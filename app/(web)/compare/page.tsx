"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { ShoppingCart, X, Plus, Sparkles, ChevronRight, Home } from "lucide-react";
import { toast } from "sonner";

import PageBanner from "@/components/customs/common/ThemBackground";
import { ProductApi } from "@/services/api/Product/product.service";
import { ProductCompareRes, ProductCardRes } from "@/schema/response/product/product.res";
import { Button } from "@/components/ui/button";
import { CartApi } from "@/services/api/Order/cart.service";
import { setCart } from "@/stores/slices/cart.store";
import { RootState } from "@/stores/store";

export default function ComparePage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const auth = useSelector((s: RootState) => s.authSlice);
  const cart = useSelector((s: RootState) => s.cartSlice);

  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [products, setProducts] = useState<ProductCompareRes[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dropdown selectors for adding products in-place
  const [allProductsList, setAllProductsList] = useState<ProductCardRes[]>([]);
  const [activeSlotDropdown, setActiveSlotDropdown] = useState<number | null>(null);

  // 1. Retrieve comparison list from localStorage on mount
  useEffect(() => {
    try {
      const compareRaw = localStorage.getItem("furniro_compare");
      if (compareRaw) {
        const ids = JSON.parse(compareRaw);
        setCompareIds(ids);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to load compare list:", err);
      setLoading(false);
    }
  }, []);

  // 2. Fetch all products list (for in-place selectors fallback)
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await ProductApi.get_product_list(0, 50);
        if (res && res.data && res.data.content) {
          setAllProductsList(res.data.content);
        }
      } catch (err) {
        console.error("Failed to fetch product list for selector:", err);
      }
    };
    fetchAllProducts();
  }, []);

  // 3. Fetch product details when compareIds change
  useEffect(() => {
    if (compareIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const fetchCompareDetails = async () => {
      setLoading(true);
      try {
        const res = await ProductApi.compare_product(compareIds);
        if (res && res.data) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch comparison data:", err);
        toast.error("Không thể tải thông tin so sánh sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompareDetails();
  }, [compareIds]);

  // 4. Remove product from compare list
  const handleRemoveProduct = (productId: number) => {
    const updatedIds = compareIds.filter((id) => id !== productId);
    setCompareIds(updatedIds);
    localStorage.setItem("furniro_compare", JSON.stringify(updatedIds));
    toast.success("Đã xóa sản phẩm khỏi danh sách so sánh.");
  };

  // 5. In-place add product to compare list
  const handleAddProductInPlace = (productId: number) => {
    if (compareIds.includes(productId)) {
      toast.info("Sản phẩm đã có trong danh sách so sánh.");
      setActiveSlotDropdown(null);
      return;
    }

    if (compareIds.length >= 3) {
      toast.warning("Chỉ có thể so sánh tối đa 3 sản phẩm.");
      setActiveSlotDropdown(null);
      return;
    }

    const updatedIds = [...compareIds, productId];
    setCompareIds(updatedIds);
    localStorage.setItem("furniro_compare", JSON.stringify(updatedIds));
    toast.success("Đã thêm sản phẩm so sánh!");
    setActiveSlotDropdown(null);
  };

  // 6. In-place Add to Cart handler
  const handleAddToCart = async (product: ProductCompareRes) => {
    if (!auth.isLoggedIn || !auth.UserID) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      router.push("/auth/login");
      return;
    }

    const toastId = toast.loading(`Đang thêm ${product.name} vào giỏ...`);
    try {
      let activeCartID = cart.cartID;

      if (!activeCartID && auth.UserID) {
        try {
          const cartRes = await CartApi.get_cart(auth.UserID);
          if (cartRes && cartRes.data) {
            activeCartID = cartRes.data.cartID;
            dispatch(setCart({
              cartID: cartRes.data.cartID,
              items: cartRes.data.items || [],
            }));
          }
        } catch (cartErr) {
          console.error("Lazy cart retrieval failed in Compare:", cartErr);
        }
      }

      const res = await CartApi.add_to_cart({
        cartID: activeCartID || 0,
        userID: auth.UserID,
        variantID: product.productID,
        quantity: 1,
        price: product.basePrice,
      });

      if (res && (res.code === 200 || res.data === true)) {
        toast.success(`Đã thêm ${product.name} vào giỏ hàng!`, { id: toastId });
        
        // Refresh cart state globally
        const cartRes = await CartApi.get_cart(auth.UserID);
        if (cartRes && cartRes.data) {
          dispatch(setCart({
            cartID: cartRes.data.cartID,
            items: cartRes.data.items || [],
          }));
        }
      } else {
        toast.error(res?.message || "Không thể thêm sản phẩm.", { id: toastId });
      }
    } catch (err) {
      console.error("Add to cart error in Compare:", err);
      toast.error("Thêm vào giỏ thất bại. Vui lòng thử lại.", { id: toastId });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="flex flex-col bg-stone-50 dark:bg-stone-950 min-h-screen font-sans">
      {/* Page Header Banner */}
      <PageBanner title="So Sánh Sản Phẩm" breadcrumb="Home > Compare" />

      {/* Main Container */}
      <main className="container mx-auto px-4 md:px-8 py-12 max-w-7xl flex-1 flex flex-col justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[40vh] gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-stone-200 border-t-yellow-600"></div>
            <p className="text-stone-500 text-sm font-semibold">Đang tổng hợp thông tin so sánh...</p>
          </div>
        ) : compareIds.length === 0 ? (
          /* Empty Comparison List State */
          <div className="max-w-xl mx-auto text-center py-16 px-6 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md rounded-[35px] border border-stone-200/40 dark:border-stone-850/40 shadow-sm flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="w-16 h-16 bg-yellow-600/10 rounded-full flex items-center justify-center border border-yellow-600/20">
              <Plus className="text-yellow-600 w-8 h-8 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold font-heading text-stone-900 dark:text-stone-50 tracking-tight leading-tight">
              Danh sách so sánh trống
            </h2>
            <p className="text-stone-500 dark:text-stone-400 font-medium text-sm leading-relaxed max-w-sm">
              Bạn chưa thêm bất kỳ sản phẩm nào vào bảng so sánh. Hãy quay lại cửa hàng để chọn các Masterpiece ưng ý nhất!
            </p>
            <Link href="/product">
              <Button className="h-12 px-8 bg-yellow-600 hover:bg-yellow-750 text-white rounded-full font-bold shadow-lg hover:shadow-yellow-600/20 active:scale-95 transition-all duration-350 cursor-pointer">
                Đến cửa hàng
              </Button>
            </Link>
          </div>
        ) : (
          /* Premium 4-Column Responsive Grid Table */
          <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
            {/* Table wrapper for horizontal scroll on mobile */}
            <div className="overflow-x-auto border border-stone-200/45 dark:border-stone-850/45 rounded-[30px] bg-white/70 dark:bg-stone-900/60 backdrop-blur-md shadow-md p-6.5 scrollbar-thin">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  {/* Row 1: Image Header & Dismiss */}
                  <tr className="border-b border-stone-200/40 dark:border-stone-800/40">
                    <th className="w-1/4 text-left py-6 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <h6 className="text-[10px] font-bold tracking-[0.25em] text-yellow-600 dark:text-yellow-500 uppercase">
                          Comparison Board
                        </h6>
                        <h2 className="text-2xl font-bold font-heading text-stone-900 dark:text-stone-50 tracking-tight leading-none">
                          Chi tiết <br />
                          <span className="text-yellow-600 italic font-medium font-heading">So Sánh</span>
                        </h2>
                        <div className="h-0.5 w-12 bg-yellow-600 rounded-full mt-2.5" />
                      </div>
                    </th>
                    
                    {[0, 1, 2].map((slotIdx) => {
                      const product = products[slotIdx];
                      return (
                        <th key={slotIdx} className="w-1/4 py-6 px-4 relative text-center">
                          {product ? (
                            <div className="relative group mx-auto w-[180px] h-[180px] p-2 bg-white dark:bg-stone-950/80 rounded-[25px] border border-stone-200/40 dark:border-stone-850/40 shadow-inner overflow-hidden transition-all duration-300 hover:shadow-md">
                              <div className="relative w-full h-full rounded-[18px] overflow-hidden">
                                <Image
                                  src={product.image || "https://placehold.co/600x600"}
                                  alt={product.name}
                                  fill
                                  sizes="180px"
                                  className="object-cover"
                                />
                              </div>
                              {/* Floating Remove Button */}
                              <button
                                onClick={() => handleRemoveProduct(product.productID)}
                                className="absolute top-3 right-3 w-7 h-7 bg-stone-900/80 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md backdrop-blur-xs hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/10"
                                aria-label="Xóa sản phẩm"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            /* Slot Empty - In-place Add Product Selector */
                            <div className="mx-auto w-[180px] h-[180px] rounded-[25px] border-2 border-dashed border-stone-200 dark:border-stone-800 flex flex-col items-center justify-center gap-3 bg-stone-50/20 dark:bg-stone-950/20 p-4 transition-all hover:border-yellow-600/40">
                              {activeSlotDropdown === slotIdx ? (
                                <div className="w-full flex flex-col gap-2 relative z-50">
                                  <label className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase font-sans">Chọn sản phẩm:</label>
                                  <select
                                    onChange={(e) => handleAddProductInPlace(Number(e.target.value))}
                                    defaultValue=""
                                    className="w-full h-9 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-bold text-stone-700 dark:text-stone-300 outline-none p-1.5 focus:border-yellow-600 cursor-pointer"
                                  >
                                    <option value="" disabled>-- Chọn --</option>
                                    {allProductsList
                                      .filter((item) => !compareIds.includes(item.productID))
                                      .map((item) => (
                                        <option key={item.productID} value={item.productID}>
                                          {item.name}
                                        </option>
                                      ))}
                                  </select>
                                  <button
                                    onClick={() => setActiveSlotDropdown(null)}
                                    className="text-[9px] font-bold text-red-500 hover:text-red-600 font-sans cursor-pointer uppercase self-end tracking-wider"
                                  >
                                    Hủy bỏ
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setActiveSlotDropdown(slotIdx)}
                                  className="w-full h-full flex flex-col items-center justify-center gap-2 cursor-pointer group text-stone-400 dark:text-stone-500 hover:text-yellow-600 dark:hover:text-yellow-500"
                                >
                                  <div className="w-10 h-10 bg-stone-100 dark:bg-stone-900 rounded-full flex items-center justify-center group-hover:bg-yellow-600/10 border border-stone-200 dark:border-stone-800 transition-colors">
                                    <Plus size={18} />
                                  </div>
                                  <span className="text-xs font-bold tracking-tight font-sans">Thêm so sánh</span>
                                </button>
                              )}
                            </div>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="font-sans font-medium text-sm sm:text-base text-stone-600 dark:text-stone-400">
                  {/* Row 2: Name */}
                  <tr className="border-b border-stone-200/40 dark:border-stone-800/40">
                    <td className="py-4 px-4 font-bold text-stone-900 dark:text-stone-50 uppercase tracking-widest text-xs font-sans">Tên sản phẩm</td>
                    {[0, 1, 2].map((slotIdx) => (
                      <td key={slotIdx} className="py-4 px-4 text-center font-heading font-bold text-stone-800 dark:text-stone-100 max-w-[200px] truncate">
                        {products[slotIdx]?.name || "—"}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Row 3: Price */}
                  <tr className="border-b border-stone-200/40 dark:border-stone-800/40">
                    <td className="py-4 px-4 font-bold text-stone-900 dark:text-stone-50 uppercase tracking-widest text-xs font-sans">Đơn giá</td>
                    {[0, 1, 2].map((slotIdx) => (
                      <td key={slotIdx} className="py-4 px-4 text-center text-yellow-600 dark:text-yellow-500 font-bold text-base">
                        {products[slotIdx] ? formatPrice(products[slotIdx].basePrice) : "—"}
                      </td>
                    ))}
                  </tr>

                  {/* Row 4: Material */}
                  <tr className="border-b border-stone-200/40 dark:border-stone-800/40">
                    <td className="py-4 px-4 font-bold text-stone-900 dark:text-stone-50 uppercase tracking-widest text-xs font-sans">Chất liệu</td>
                    {[0, 1, 2].map((slotIdx) => (
                      <td key={slotIdx} className="py-4 px-4 text-center text-stone-800 dark:text-stone-200">
                        {products[slotIdx]?.material || "—"}
                      </td>
                    ))}
                  </tr>

                  {/* Row 5: Dimensions */}
                  <tr className="border-b border-stone-200/40 dark:border-stone-800/40">
                    <td className="py-4 px-4 font-bold text-stone-900 dark:text-stone-50 uppercase tracking-widest text-xs font-sans">Kích thước (C x R x S)</td>
                    {[0, 1, 2].map((slotIdx) => {
                      const p = products[slotIdx];
                      return (
                        <td key={slotIdx} className="py-4 px-4 text-center text-stone-800 dark:text-stone-200">
                          {p ? `${p.height} x ${p.width} x ${p.depth} cm` : "—"}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row 6: Weight */}
                  <tr className="border-b border-stone-200/40 dark:border-stone-800/40">
                    <td className="py-4 px-4 font-bold text-stone-900 dark:text-stone-50 uppercase tracking-widest text-xs font-sans">Trọng lượng</td>
                    {[0, 1, 2].map((slotIdx) => (
                      <td key={slotIdx} className="py-4 px-4 text-center text-stone-800 dark:text-stone-200">
                        {products[slotIdx] ? `${products[slotIdx].weight} kg` : "—"}
                      </td>
                    ))}
                  </tr>

                  {/* Row 7: Warranty */}
                  <tr className="border-b border-stone-200/40 dark:border-stone-800/40">
                    <td className="py-4 px-4 font-bold text-stone-900 dark:text-stone-50 uppercase tracking-widest text-xs font-sans">Chính sách bảo hành</td>
                    {[0, 1, 2].map((slotIdx) => (
                      <td key={slotIdx} className="py-4 px-4 text-center text-xs leading-relaxed max-w-[200px] text-stone-500 dark:text-stone-400">
                        {products[slotIdx]?.warranty || "—"}
                      </td>
                    ))}
                  </tr>

                  {/* Row 8: Action Buy Footer */}
                  <tr>
                    <td className="py-6 px-4" />
                    {[0, 1, 2].map((slotIdx) => {
                      const p = products[slotIdx];
                      return (
                        <td key={slotIdx} className="py-6 px-4 text-center">
                          {p ? (
                            <Button
                              onClick={() => handleAddToCart(p)}
                              className="h-11 px-5 bg-yellow-600 hover:bg-yellow-750 text-white rounded-full font-bold shadow-md hover:scale-102 active:scale-98 transition-all duration-300 cursor-pointer flex items-center gap-1.5 mx-auto text-xs"
                            >
                              <ShoppingCart size={14} />
                              Add to cart
                            </Button>
                          ) : (
                            "—"
                          )}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
