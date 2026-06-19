import Footer from "@/components/Footer";

const layout = ({ children }) => {
  return (
    <>
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default layout;
