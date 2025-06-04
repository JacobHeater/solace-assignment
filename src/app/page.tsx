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
      <header>
        <div className="fixed top-0 left-0 w-full bg-[var(--solace-green)] text-[var(--solace-foreground)] py-5 px-4 font-bold text-xl shadow-b-lg drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]">Solace Advocates</div>
      </header>
      <main className="m-24">
        <div>
          <p>Search</p>
          <p>
            Searching for: <span id="search-term">{searchTerm}</span>
          </p>
          <input style={{ border: "1px solid black" }} onChange={onChange} value={searchTerm} />
          <button onClick={onClick}>Reset Search</button>
        </div>
        <br />
        <br />
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>City</th>
              <th>Degree</th>
              <th>Specialties</th>
              <th>Years of Experience</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdvocates.map((advocate) => {
              return (
                <tr key={advocate.phoneNumber}>
                  <td>{advocate.firstName}</td>
                  <td>{advocate.lastName}</td>
                  <td>{advocate.city}</td>
                  <td>{advocate.degree}</td>
                  <td>
                    {advocate.specialties.map((s) => (
                      <div key={s}>{s}</div>
                    ))}
                  </td>
                  <td>{advocate.yearsOfExperience}</td>
                  <td>{advocate.phoneNumber}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <ToastContainer />
      </main>
    </>
  );
}
