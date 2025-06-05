"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useDebounce } from "use-debounce";
import { Chip } from "./components/chip";
import { Button } from "./components/button";
import { IAdvocate } from "./types/advocate";

export default function Home() {
  const [advocates, setAdvocates] = useState<IAdvocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const router = useRouter();

  useEffect(() => {
    const fetchAdvocates = async () => {
      setLoading(true);
      console.log("fetching advocates...");
      try {
        let url = '/api/advocates';

        if (debouncedSearchTerm) {
          url += `?searchTerm=${debouncedSearchTerm}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          toast.error('Could not connect to API to retrieve advocates');
          setInitialized(false);
          return;
        }
        const jsonResponse = await response.json();
        setAdvocates(jsonResponse.data as IAdvocate[]);
        setInitialized(true);
      } catch (error) {
        console.error("Failed to fetch advocates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvocates();
  }, [debouncedSearchTerm]);

  const onSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
  };

  const onResetSearchClick = () => {
    setSearchTerm('');
  };

  return (
    <>
      <div className="m-24">
        <div className="mb-10 flex flex-row align-items-center">
          <div className="mt-5">
            <span className="font-bold text-2xl mr-8 m">Search</span>
            <input
              type="text"
              onChange={onSearchTermChange} value={searchTerm}
              className="rounded-2xl py-1 px-2 border-[1.5px] focus:border-[1.5px] outline-none focus:outline-none focus:ring-0 w-[30vw]"
              placeholder="Enter search term"
              disabled={!initialized} />
            <Button onClick={onResetSearchClick}>Reset Search</Button>
          </div>
        </div>
        {advocates.length > 0 && (
          <table className="w-full border-[1px] border-[var(--solace-green)]">
            <thead>
              <tr className="bg-[var(--solace-green)] text-[var(--solace-foreground)] h-14">
                {['First Name', 'Last Name', 'City', 'Degree', 'Specialties', 'Years of Experience', 'Phone Number', 'View'].map((col, i) => (
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
                      {advocate.specialties.map((s, i) => (
                        <Chip key={i} text={s.title} />
                      ))}
                    </td>
                    <td>{advocate.yearsOfExperience}</td>
                    <td>{advocate.phoneNumber}</td>
                    <td className="pr-5 text-center">
                      <Button onClick={() => router.push(`/advocate/${advocate.id}`)}>View</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {!loading && advocates.length === 0 && debouncedSearchTerm.trim() && (
          <div className="text-center">
            <span className="text-2xl align-middle inline-block">🥴</span> No records found matching &quot;{debouncedSearchTerm}&quot;
          </div>
        )}
        {!loading && advocates.length === 0 && !debouncedSearchTerm.trim() && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              No data to display. Please try refreshing the page and if the issue persists, contact customer care&nbsp;
              <a href="tel:555-555-1212" className="underline text-[var(--solace-green)]">555-555-1212</a>.
            </div>
          </div>
        )}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              Loading advocate data. Please wait...
            </div>
          </div>
        )}
      </div>
    </>
  );
}
