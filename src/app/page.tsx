"use client";

import { PublicAdvocate } from "@/db/schema";
import { useEffect, useState } from "react";
import { ToastContainer, ToastOptions, toast } from 'react-toastify';
import { useDebounce } from "use-debounce";

const TOAST_SETTINGS: ToastOptions = {
  position: 'bottom-right'
};

export default function Home() {
  const [advocates, setAdvocates] = useState<PublicAdvocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [initialized, setInitailized] = useState(false);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchAdvocates = async () => {
      console.log("fetching advocates...");
      try {
        let url = '/api/advocates';

        if (debouncedSearchTerm) {
          url += `?searchTerm=${debouncedSearchTerm}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          toast.error('Could not connect to API to retrieve advocates', TOAST_SETTINGS);
          setInitailized(false);
          return;
        }
        const jsonResponse = await response.json();
        setAdvocates(jsonResponse.data as PublicAdvocate[]);
        setInitailized(true);
      } catch (error) {
        console.error("Failed to fetch advocates:", error);
      }
    };

    fetchAdvocates();
  }, [debouncedSearchTerm]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
  };

  const onClick = () => {
    setSearchTerm('');
  };

  return (
    <>
      <header className="fixed z-50 top-0 left-0 w-full bg-[var(--solace-green)] text-[var(--solace-foreground)] py-5 pl-[90px] font-bold text-xl shadow-b-lg drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]">
        <div>Solace Advocates</div>
      </header>
      <main className="m-24">
        {initialized && (
          <div className="mb-10 flex flex-row align-items-center">
            <div className="mt-5">
              <span className="font-bold text-2xl mr-8 m">Search</span>
              <input
                type="text"
                onChange={onChange} value={searchTerm}
                className="rounded-2xl py-1 px-2 border-[1.5px] focus:border-[1.5px] outline-none focus:outline-none focus:ring-0 w-[30vw]"
                placeholder="Enter search term" />
              <button
                className="bg-[var(--solace-green)] text-[var(--solace-foreground)] ml-8 py-1 px-2 rounded drop-shadow active:drop-shadow-none"
                onClick={onClick}>Reset Search</button>
            </div>
          </div>
        )}
        {advocates.length > 0 && (
          <table className="w-full border-[1px] border-[var(--solace-green)]">
            <thead>
              <tr className="bg-[var(--solace-green)] text-[var(--solace-foreground)] h-14">
                {['First Name', 'Last Name', 'City', 'Degree', 'Specialties', 'Years of Experience', 'Phone Number'].map((col, i) => (
                  <th className="px-2 py-1" key={i}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {advocates.map((advocate) => {
                return (
                  <tr key={advocate.phoneNumber} className="odd:bg-gray-100 h-14">
                    <td className="pl-5">{advocate.firstName}</td>
                    <td>{advocate.lastName}</td>
                    <td>{advocate.city}</td>
                    <td className="w-32 text-center">{advocate.degree}</td>
                    <td>
                      {advocate.specialties.map((s) => (
                        <div key={s} className="inline-block px-2 py-1 rounded-2xl bg-[var(--chip-green)] mr-3 drop-shadow">{s}</div>
                      ))}
                    </td>
                    <td>{advocate.yearsOfExperience}</td>
                    <td className="pr-5">{advocate.phoneNumber}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {advocates.length === 0 && searchTerm.trim() && (
          <div className="text-center">
            <span className="text-2xl align-middle inline-block">🥴</span> No records found matching &quot;{searchTerm}&quot;
          </div>
        )}
        {advocates.length === 0 && !searchTerm.trim() && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              No data to display. Please try refreshing the page and if the issue persists, contact customer care&nbsp;
              <a href="tel:555-555-1212" className="underline text-[var(--solace-green)]">555-555-1212</a>.
            </div>
          </div>
        )}
        <ToastContainer />
      </main >
    </>
  );
}
