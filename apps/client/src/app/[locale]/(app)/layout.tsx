import { Nav } from "components/nav/Nav";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout(props: RootLayoutProps) {
  return (
    <>
      <Nav />
      {props.children}
    </>
  );
}
