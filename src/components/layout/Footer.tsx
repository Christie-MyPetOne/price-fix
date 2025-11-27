export function Footer() {
  return (
    <footer className="p-4 text-center shadow-inner mt-auto bg-background">
      <p className="text-sm text-text">
        &copy; {new Date().getFullYear()}{" "}
        <span className="text-primary font-semibold">PriceFix</span> —
        Inteligência aplicada ao seu negócio
      </p>
    </footer>
  );
}
