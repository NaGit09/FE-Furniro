import RegisterForm from "@/components/customs/auth/RegisterForm";
const page = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className=" w-full flex flex-col items-center justify-center gap-4">
        <RegisterForm />
      </main>
    </div>
  );
};

export default page;
