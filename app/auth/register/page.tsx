import type { Metadata } from "next";
import Image from "next/image";
import RegisterForm from "@/components/customs/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Register a new Furniro account and explore our curated collection of premium furniture.",
};

export default function RegisterPage() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          overflow: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 16px",
        }}
      >
        <div
          style={{ position: "absolute", inset: 0, zIndex: 0 }}
          aria-hidden="true"
        >
          <Image
            src="/login-bg.png"
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(120,53,15,0.58) 0%, rgba(202,138,4,0.22) 50%, rgba(120,53,15,0.45) 100%)",
            }}
          />
        </div>

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-10%",
              left: "-8%",
              width: "420px",
              height: "420px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(202,138,4,0.22) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-12%",
              right: "-6%",
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(180,83,9,0.2) 0%, transparent 70%)",
              filter: "blur(50px)",
            }}
          />
        </div>

        {/* ── Interactive register form (client component) ── */}
        <main
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <RegisterForm />
        </main>
      </div>
    </>
  );
}
