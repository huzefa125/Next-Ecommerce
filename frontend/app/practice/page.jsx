import React from 'react'

const page = () => {
    const faqs = [
        {
            question: "What is your return policy?",
            answer:
                "We offer a 7-day return policy. Items must be unused and in original packaging.",
        },
        {
            question: "How long does delivery take?",
            answer:
                "Delivery usually takes 3–5 business days depending on your location.",
        },
        {
            question: "Do you offer cash on delivery?",
            answer:
                "Yes, Cash on Delivery (COD) is available for selected locations.",
        },
        {
            question: "How can I contact support?",
            answer:
                "You can contact our support team via email or the contact form on our website.",
        },
    ];
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index)
    }

    return (
        <div className='min-h-screen bg-green-100 flex justify-center items-center'>
            <div className='w-full max-w-2xl bg-white p-6 rounded-lg shadow-md'>
                <h2>Frequently Asked Questions</h2>
                <div className='space-y-4'>
                    {
                        faqs.map((faq, index) => {
                            <div key={index} className='border rounded-lg overflow-hidden'>
                                <button onClick={() => toggleFAQ(index)} className='w-full flex justify-center items-center p-4'><span>{faq.question}</span><span className='text-xl'>{activeIndex === index ? "-" : "+"}</span></button>
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default page