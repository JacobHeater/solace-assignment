"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useDebounce } from "use-debounce";
import { Chip } from "./components/chip";
import { Button } from "./components/button";
import { IAdvocate } from "./types/advocate";
import { SortDir } from "@/db/sort/sort-dir";
import { SelectAdvocate } from "@/db/schema";
import { toCamelCase } from '@/app/helpers/string/to-camel-case';

export default function Home() {
  const pageSize = 10;
  const [advocates, setAdvocates] = useState<IAdvocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [recordCount, setRecordCount] = useState<number>(0);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [sortCol, setSortCol] = useState<keyof SelectAdvocate | null>(null);
  let [sortDir, setSortDir] = useState<SortDir | null>(null)
  const router = useRouter();

  const xOfRecordCount = () => {
    const totalOnPage = (pageNumber + 1) * pageSize;

    if (totalOnPage > recordCount) {
      const delta = totalOnPage - recordCount;
      return totalOnPage - delta;
    }

    return totalOnPage;
  };

  useEffect(() => {
    const fetchAdvocates = async () => {
      setLoading(true);
      console.log("fetching advocates...");
      try {
        const url = new URL(`${window.location.protocol}//${window.location.host}/api/advocates`);

        if (debouncedSearchTerm) {
          url.searchParams.set('searchTerm', debouncedSearchTerm);
        }

        if (sortCol) {
          url.searchParams.set('sortCol', sortCol);
        }

        if (sortDir) {
          url.searchParams.set('sortDir', sortDir.toString());        

        if (debouncedSearchTerm) {
          url.searchParams.set('searchTerm', debouncedSearchTerm);
        }

        url.searchParams.set('pageNumber', String(pageNumber));

        const response = await fetch(url);

        if (!response.ok) {
          toast.error('Could not connect to API to retrieve advocates');
          setInitialized(false);
          return;
        }
        const { data, count }: { data: IAdvocate[], count?: number } = await response.json();
        setAdvocates(data as IAdvocate[]);
        setRecordCount(count || 0);
        setInitialized(true);
      } catch (error) {
        console.error("Failed to fetch advocates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvocates();
  }, [debouncedSearchTerm, sortCol, sortDir, pageNumber]);

  const onSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
  };

  const onResetSearchClick = () => {
    setSearchTerm('');
  };

  const onColHeaderClick = (col: string) => {
    const sortableCols = [
      'first name',
      'last name',
      'city',
      'degree',
      'years of experience',
      'phone number'
    ];

    if (!sortableCols.includes(col.toLowerCase())) return;

    const selectedCol: keyof SelectAdvocate = toCamelCase(col) as keyof SelectAdvocate;

    let nextSortDir: SortDir | null = SortDir.ASC;

    if (sortCol === selectedCol) {
      switch (sortDir) {
        case SortDir.ASC:
          nextSortDir = SortDir.DESC;
          break;
        case SortDir.DESC:
          nextSortDir = null;
          break;
        default:
          nextSortDir = SortDir.ASC;
          break;
      }
    }

    setSortCol(selectedCol);
    setSortDir(nextSortDir);
  };

  return (
    <>
      <div className="px-5 md:px-20 mb-10">
        <div className="mb-10 flex flex-row align-items-center">
          <span className="font-bold text-xl md:text-2xl mr-2 md:mr-8 m">Search</span>
          <input
            type="text"
            onChange={onSearchTermChange} value={searchTerm}
            className="rounded-2xl py-1 px-2 border-[1.5px] focus:border-[1.5px] outline-none focus:outline-none focus:ring-0 w-[40vw]"
            placeholder="Enter search term"
            disabled={!initialized} />
          <Button className="ml-2 md:ml-8" onClick={onResetSearchClick}>Reset Search</Button>
        </div>
        {advocates.length > 0 && (
          <div className="w-full overflow-x-auto">
            <table className="border-[1px] border-[var(--solace-green)]">
              <thead>
                <tr className="bg-[var(--solace-green)] text-[var(--solace-foreground)] h-14">
                {['First Name', 'Last Name', 'City', 'Degree', 'Specialties', 'Years of Experience', 'Phone Number', 'View'].map((col, i) => (
                  <th onClick={() => onColHeaderClick(col)} className="px-2 py-1" key={i}>{col}</th>
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
                      <td className="px-5">
                        <Button onClick={() => router.push(`/advocate/${advocate.id}`)}>View</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex flex-row">
          <div className="flex-[0.25] pt-3">
            Showing {xOfRecordCount()} advocates of {recordCount}
          </div>
          <div className="flex-[0.75] text-right pt-3">
            {'a'.repeat(Math.ceil(recordCount / pageSize)).split('').map((_, idx) => (
              <span key={idx} onClick={() => setPageNumber(idx)} className={`inline select-none cursor-pointer px-2 text-center text-[var(--solace-green)] ${(idx) === pageNumber ? 'underline font-bold' : ''}`}>{idx + 1}</span>
            ))}
          </div>
        </div>
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
