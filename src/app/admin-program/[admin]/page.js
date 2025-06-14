import ClientPage from "./client";

export default function AdminProgramPage({ params }) {
  return <ClientPage admin={params.admin} />;
}

export async function generateStaticParams() {
  return [{ admin: "admin" }]; 
}
