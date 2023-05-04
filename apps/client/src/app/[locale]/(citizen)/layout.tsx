export default function CitizenLayout(props) {
  return (
    <main className="mt-5 px-4 md:px-6 pb-5 container max-w-[100rem] mx-auto">
      {props.children}
    </main>
  );
}
