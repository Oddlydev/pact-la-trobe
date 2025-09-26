import React, { useState } from "react";
import type { GetServerSideProps } from "next";
import type { RowDataPacket } from "mysql2";
import { getPool } from "@/lib/mysql";
import Layout from "@/src/components/Layout";
import EditPatientDrawer from "@/src/components/Drawer/EditPatientDrawer";
import ConfirmDeleteModal from "@/src/components/Modal/ConfirmDeleteModal";
import SearchBar from "@/src/components/Forms/SearchBar";
import Pagination from "@/src/components/Pagination/Pagination";
import PatientManagementTable from "@/src/components/Tables/PatientManagementTable";

type DbPatientRow = {
  patientId: string;
  firstName: string | null;
  lastName: string | null;
  address: string | null;
  phone: string | null;
  gender: string | null;
  deleteReason?: string | null;
};
type Patient = {
  id: string;
  name: string;
  address: string;
  phone: string;
  gender: "M" | "F" | "NA";
};

type PageProps = {
  initialPatients: Patient[];
};

const allPatients: Patient[] = [];

export default function PatientManagementPage({ initialPatients }: PageProps) {
  const [patients, setPatients] = useState<Patient[]>(
    initialPatients?.length ? initialPatients : allPatients
  );
  const [search, setSearch] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);

  const itemsPerPage = 10;

  // Filter
  const filtered = patients.filter((p) => {
    const q = search.toLowerCase();
    const textMatch =
      p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    // Table handles gender filtering internally; keep page filter to search only
    return textMatch;
  });

  // Paginate
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  React.useEffect(() => {
    const load = async () => {
      try {
        const resp = await fetch("/api/patients");
        const json = await resp.json();
        if (resp.ok && json?.ok) {
          const mapped: Patient[] = (json.data as any[]).map((r) => {
            const g = String(r.gender || "")
              .trim()
              .toUpperCase();
            return {
              id: r.id,
              name: r.name,
              address: r.address || "",
              phone: r.phone || "",
              gender:
                g === "FEMALE" || g === "F"
                  ? ("F" as const)
                  : g === "MALE" || g === "M"
                    ? ("M" as const)
                    : ("NA" as any),
            };
          });
          setPatients(mapped);
        }
      } catch (e) {
        // keep fallback data silently
      }
    };
    load();
    const handler = () => load();
    window.addEventListener("patients:reload", handler);
    return () => window.removeEventListener("patients:reload", handler);
  }, []);

  // Gender filter UI is managed inside the table component.

  return (
    <Layout>
      <main className="mx-auto px-4 pb-4 pt-5 w-full rounded-xl border border-white bg-[rgba(0,0,0,0.00)] p-4">
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

          <div className="w-full max-w-xl flex items-center gap-2 relative">
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
          onEdit={(p) => {
            setPatientToEdit(p);
            setEditOpen(true);
          }}
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
            label="patients"
          />
        </div>
      </main>

      {/* Drawer & Modal */}
      <EditPatientDrawer
        open={editOpen}
        patientId={patientToEdit?.id}
        onClose={() => setEditOpen(false)}
      />
      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async (reason) => {
          if (!patientToDelete) return;
          try {
            const resp = await fetch(`/api/patients/${patientToDelete.id}`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reason }),
            });
            const json = await resp.json();
            if (!resp.ok || !json?.ok)
              throw new Error(json?.error || "Delete failed");
            window.dispatchEvent(new Event("patients:reload"));
            setPatients((prev) =>
              prev.filter((x) => x.id !== patientToDelete.id)
            );
          } catch (e) {
            alert("Failed to delete patient.");
          }
        }}
      />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
  try {
    const pool = getPool();
    const [rows] = await pool.query<(DbPatientRow & RowDataPacket)[]>(
      `SELECT * FROM patients WHERE (deleteReason IS NULL OR deleteReason = '') ORDER BY id DESC`
    );

    const initialPatients: Patient[] = rows.map((r) => {
      const g = String(r.gender || "")
        .trim()
        .toUpperCase();
      return {
        id: r.patientId,
        name: `${r.firstName || ""} ${r.lastName || ""}`.trim(),
        address: r.address || "",
        phone: r.phone || "",
        gender:
          g === "FEMALE" || g === "F"
            ? "F"
            : g === "MALE" || g === "M"
              ? "M"
              : "NA",
      } as Patient;
    });
    return { props: { initialPatients } };
  } catch {
    return { props: { initialPatients: [] } };
  }
};
