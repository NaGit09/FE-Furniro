import { ProductDetail } from "@/schema/response/product.res";
import React from "react";

const ProductDescription = ({ data }: { data: ProductDetail }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Description */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Description
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {data.description || "No description available."}
          </p>
        </div>

        {/* Dimensions */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Dimensions
          </h2>
          <div className="space-y-2 text-gray-600">
            <p>
              <span className="font-medium text-gray-800">Height:</span>{" "}
              {data.height}
            </p>
            <p>
              <span className="font-medium text-gray-800">Width:</span>{" "}
              {data.width}
            </p>
            <p>
              <span className="font-medium text-gray-800">Depth:</span>{" "}
              {data.depth}
            </p>
            <p>
              <span className="font-medium text-gray-800">Weight:</span>{" "}
              {data.weight}
            </p>
          </div>
        </div>

        {/* Warranty */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Warranty</h2>
          <div className="space-y-2 text-gray-600">
            <p>
              <span className="font-medium text-gray-800">Type:</span>{" "}
              {data.warrantyType}
            </p>
            <p>
              <span className="font-medium text-gray-800">Duration:</span>{" "}
              {data.warrantyDuration}
            </p>
            <p>
              <span className="font-medium text-gray-800">Summary:</span>{" "}
              {data.warrantySummary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;
