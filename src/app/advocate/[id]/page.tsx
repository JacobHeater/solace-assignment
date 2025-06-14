'use client';

import { Button } from "@/app/components/button";
import { Chip } from "@/app/components/chip";
import { IAdvocate } from "@/app/types/advocate";
import { ISpecialty } from "@/app/types/specialty";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { toast } from 'react-toastify';

type AdvocatePropValue = string | Date | number | ISpecialty[] | React.ReactNode;
type AdvocatePropItem = {
    label: string;
    col: keyof IAdvocate;
};
type AdvocatePropsArray = AdvocatePropItem[];

export default function AdvocateView() {
    const { id } = useParams();
    const [advocate, setAdvocate] = useState<IAdvocate | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchAdvocate = async () => {
            setLoading(true);
            const response = await fetch(`/api/advocate/${id}`);

            if (!response.ok) {
                toast.error(`Could not load the advocate you were looking for.`);
                return;
            }

            const advocateResponse: IAdvocate | null = await response.json();
            setAdvocate(advocateResponse);

            if (advocateResponse === null) {
                toast.warn(`No advocate was found using id: ${id}`);
                return;
            }
            setLoading(false);
        };

        fetchAdvocate();
    }, []);

    return (
        <>
            <div className="mt-24">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            Loading advocate data. Please wait...
                        </div>
                    </div>
                )}
                {!advocate && !loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            🥴 Sorry! We couldn't find an Advocate by that id. Please go back
                            to the <Link href="/" className="underline text-[var(--solace-green)]">home</Link> page, and try searching for that
                            advocate again.
                        </div>
                    </div>
                )}
                {advocate && (
                    <div className="w-[600px] mx-auto">
                        <div className="w-[300px] h-[300px] border border-gray-300 mx-auto">
                            <Image width={300} height={300} src="/profile.png" alt="Profile picture" priority />
                        </div>
                        <div className="flex flex-col w-full mt-10">
                            {([{
                                label: 'First Name',
                                col: 'firstName'
                            },
                            {
                                label: 'Last Name',
                                col: 'lastName'
                            },
                            {
                                label: 'Phone Number',
                                col: 'phoneNumber'
                            },
                            {
                                label: 'Degree',
                                col: 'degree'
                            },
                            {
                                label: 'Years of Experience',
                                col: 'yearsOfExperience'
                            },
                            {
                                label: 'City',
                                col: 'city'
                            }, {
                                label: 'Specialties',
                                col: 'specialties'
                            }] as AdvocatePropsArray).map((item) => {
                                
                                let value: AdvocatePropValue = advocate[item.col];

                                if (item.col === 'specialties') {
                                    value = (value as ISpecialty[]).map((spc, i) => <div key={i} className="mb-2">
                                        <Chip text={spc.title} />
                                    </div>);
                                }

                                return (
                                    <div className="flex flex-row mb-4" key={item.col}>
                                        <div className="font-bold">{item.label}</div>
                                        <div className="ml-auto">{value as ReactNode}</div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="text-center mt-10">
                            <Button onClick={() => router.push("/")}>Back to Home Page</Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
