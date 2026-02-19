"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import AddHolidayModal from "@/app/components/pages/add_holiday_modal";

import { db } from "@/lib/firebase_config";

export default function HolidayListModal({ onClose }) {
    const [holidays, setHolidays] = useState([]);
    const [showAddHolidayModal, setShowAddHolidayModal] = useState(false);
    const [selectedHoliday, setSelectedHoliday] = useState(null);

    const router = useRouter();

    useEffect(() => {
        fetchHolidays();
    }, []);

    const fetchHolidays = async () => {
        const snap = await getDocs(collection(db, "CompanyHolidays"));
        const data = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
        }));
        setHolidays(data);
    };

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, "CompanyHolidays", id));
        fetchHolidays();
        router.refresh();
    };

  return (
    <dialog className="modal modal-open">
        <div className="modal-box w-h-max h-9/12">
            <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" 
                    onClick={onClose}>
                    ✕
                </button>
            </form>

                <table className="table table-sm">
                    <thead>
                        <tr>
                        <th className="text-center">No</th>
                        <th>Date</th>
                        <th>Title</th>
                        <th className="text-center">                          
                            <button 
                                type="button"
                                className="btn btn-soft btn-info rounded-full "
                                onClick={() => setShowAddHolidayModal(true)}
                            >
                                <span class="mingcute--add-fill"></span> Add
                            </button>
                        </th>
                        </tr>
                    </thead>
                        <tbody>
                        {holidays.map((h, index) => (
                            <tr key={h.id}>
                                <td className="text-center text-[14px]">{index + 1}</td>
                                <td className="text-[14px]">{h.date}</td>
                                <td className="text-[14px]">{h.title}</td>
                                <td className="text-center">
                                    <div className="dropdown dropdown-end">
                                        <div tabindex="0" role="button" className="btn btn-ghost btn-xs"><span className="solar--menu-dots-bold"></span></div>
                                            <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 p-2 w-40  shadow-sm">
                                                <li>
                                                    <a
                                                        onClick={() => {
                                                        setSelectedHoliday(h);
                                                        setShowAddHolidayModal(true);
                                                        }}
                                                    >
                                                        <span className="cuida--edit-outline"></span>
                                                        Edit
                                                    </a>
                                                </li>

                                                <li onClick={() => handleDelete(h.id)}>
                                                    <a className="text-[#ea0000]">
                                                        <span className="solar--trash-bin-minimalistic-broken"></span>
                                                        Delete
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            {showAddHolidayModal && (
                <AddHolidayModal
                    holiday={selectedHoliday}
                    onClose={() => {
                    setShowAddHolidayModal(false);
                    setSelectedHoliday(null);
                    fetchHolidays();
                    }}
                />
            )}
    </dialog>
  );
}
