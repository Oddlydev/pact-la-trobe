import React, { useState } from "react";
import Layout from "@/src/components/Layout";
import EditPatientDrawer from "@/src/components/Patients/EditPatientDrawer";
import ConfirmDeleteModal from "@/src/components/Modal/ConfirmDeleteModal";
import SearchBar from "@/src/components/SearchBar/SearchBar";
import Pagination from "@/src/components/Pagination/Pagination";
import PatientManagementTable from "@/src/components/Tables/PatientManagementTable";

type Patient = {
  id: string;
  name: string;
  address: string;
  phone: string;
  gender: "M" | "F";
};

const allPatients: Patient[] = [
  {
    id: "PT134434",
    name: "Pathirannehelage Don Nimal Sirisena Bandara Pathirannehelage",
    address: "1087 Harrington–Blythe Crescent, South Yarra, Melbourne VIC 3141",
    phone: "+61 3 9876 5432",
    gender: "M",
  },
  {
    id: "PT134434",
    name: "Annabelle Sophia Catherine Alexandra Whitmore–Sutherland",
    address: "530 Harrington–Wentworth Gardens, Braddon, Canberra ACT 2612",
    phone: "+61 7 3344 2211",
    gender: "F",
  },
  {
    id: "PT134434",
    name: "Sandra Bullock",
    address: "6 Forest Ln, Cairns QLD 4870",
    phone: "+61 8 8222 7788",
    gender: "F",
  },
  {
    id: "PT134434",
    name: "Ranasinghe Arachchige Don Sanath Teran Jayasuriya",
    address: "1579 Whitmore–Sutherland Avenue, Cottesloe, Perth WA 6011",
    phone: "+61 3 6221 9090",
    gender: "M",
  },
  {
    id: "PT134435",
    name: "Smith Johnathan",
    address: "42 Elm Street, Springfield, IL 62701",
    phone: "+61 8 9467 1234",
    gender: "M",
  },
  {
    id: "PT134436",
    name: "Nguyen Thi Mai",
    address: "23 Nguyen Hue Street, Ho Chi Minh City, Vietnam",
    phone: "+61 412 345 678",
    gender: "F",
  },
  {
    id: "PT134437",
    name: "Garcia Maria",
    address: "789 Calle del Sol, Madrid, Spain",
    phone: "+61 423 987 654",
    gender: "F",
  },
];

export default function PatientManagementPage() {
  const [patients] = useState(allPatients);
  const [search, setSearch] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  const itemsPerPage = 10;

  // 🔎 Filter
  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
  );

  // 📄 Paginate
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout>
      <main className="mx-aut0 px-4 pb-4 pt-5 w-full rounded-xl border border-white bg-[rgba(0,0,0,0.00)] p-4">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black leading-9 tracking-tighter text-black font-dmsans">
              Patient Management
            </h1>
            <p className="text-base leading-6 font-normal text-gray-500">
              Stay in control of every patient’s journey
            </p>
          </div>

          <div className="w-full max-w-sm">
            <SearchBar
              placeholder="Search Patient by name or ID"
              value={search}
              onChange={setSearch}
            />
          </div>
        </header>

        {/* Table */}
        <PatientManagementTable
          patients={paginated}
          onEdit={(p) => setEditOpen(true)}
          onDelete={(p) => {
            setPatientToDelete(p);
            setDeleteOpen(true);
          }}
        />

        {/* Pagination */}
        <div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>

      {/* Drawer & Modal */}
      <EditPatientDrawer open={editOpen} onClose={() => setEditOpen(false)} />
      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
      />
    </Layout>
  );
}
