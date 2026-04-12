import LoginForm from "@/components/customs/auth/LoginForm";
const page = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className=" w-full flex flex-col items-center justify-center gap-4">
        <LoginForm />
      </main>
    </div>
  );
};

export default page;
