"use client";

import { PublicAdvocate } from "@/db/schema";
import { useEffect, useState } from "react";
import { ToastContainer, ToastOptions, toast } from 'react-toastify';

const TOAST_SETTINGS: ToastOptions = {
  position: 'bottom-right'
};

export default function Home() {
  const [advocates, setAdvocates] = useState<PublicAdvocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<PublicAdvocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAdvocates = async () => {
      console.log("fetching advocates...");
      try {
        const response = await fetch("/api/advocates");
        if (!response.ok) {
          toast.error('Could not connect to API to retrieve advocates', TOAST_SETTINGS);
          return;
        }
        const jsonResponse = await response.json();
        setAdvocates(jsonResponse.data as PublicAdvocate[]);
        setFilteredAdvocates(jsonResponse.data as PublicAdvocate[]);
      } catch (error) {
        console.error("Failed to fetch advocates:", error);
      }
    };

    fetchAdvocates();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    console.log("filtering advocates...");
    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.includes(searchTerm) ||
        advocate.lastName.includes(searchTerm) ||
        advocate.city.includes(searchTerm) ||
        advocate.degree.includes(searchTerm) ||
        advocate.specialties.some((s) => s.includes(searchTerm)) ||
        advocate.phoneNumber.includes(searchTerm) ||
        String(advocate.yearsOfExperience).includes(searchTerm)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    console.log(advocates);
    setFilteredAdvocates(advocates);
    setSearchTerm('');
  };

  return (
    <>
      <header className="fixed z-50 top-0 left-0 w-full bg-[var(--solace-green)] text-[var(--solace-foreground)] py-5 px-4 font-bold text-xl shadow-b-lg drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]">
        <div>Solace Advocates</div>
      </header>
      <main className="m-24">
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
        {filteredAdvocates.length > 0 ? (
          <table className="w-full border-[1px] border-[var(--solace-green)]">
            <thead>
              <tr className="bg-[var(--solace-green)] text-[var(--solace-foreground)] h-14">
                {['First Name', 'Last Name', 'City', 'Degree', 'Specialties', 'Years of Experience', 'Phone Number'].map((col, i) => (
                  <th className="px-2 py-1" key={i}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredAdvocates.map((advocate) => {
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
        ) : (
          <div className="text-center">
            <span className="text-2xl align-middle inline-block">🥴</span> No records found matching &quot;{searchTerm}&quot;
          </div>
        )}
        <ToastContainer />
      </main>
    </>
  );
}
