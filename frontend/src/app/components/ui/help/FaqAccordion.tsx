'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface FaqAccordionProps {
    title: string;
    questions: string[];
}

export default function FaqAccordion({ title, questions }: FaqAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="flex w-full flex-col items-start rounded-[12.75px] border border-[#bdc9c6] bg-white p-[18.5px]">
            <div className="flex items-center gap-[7px]">
                <HelpCircle size={16} className="shrink-0 text-[#0f766e]" />
                <h3 className="text-[12.25px] leading-[17.5px] font-bold text-[#0f172b]">{title}</h3>
            </div>

            <div className="flex w-full flex-col pt-[3.5px]">
                {questions.map((question, index) => {
                    const isOpen = openIndex === index;
                    const isLast = index === questions.length - 1;
                    return (
                        <div key={question} className={isLast ? '' : 'border-b border-[#f1f5f9]'}>
                            <button
                                type="button"
                                onClick={() => setOpenIndex(isOpen ? null : index)}
                                aria-expanded={isOpen}
                                className="flex w-full items-center justify-between gap-[14px] py-[14px] text-left"
                            >
                                <span className="text-[12.25px] leading-[17.5px] font-medium text-[#1d293d]">{question}</span>
                                <ChevronDown
                                    size={16}
                                    className={`shrink-0 text-[#90a1b9] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                />
                            </button>
                            {isOpen && (
                                <p className="pb-[14px] text-[12.25px] leading-[17.5px] text-[#62748e]">
                                    Tim support kami siap membantu menjawab pertanyaan ini. Hubungi kami melalui Live Chat untuk
                                    informasi lebih lanjut.
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
