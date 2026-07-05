export default function UpcomingTraining(){

    const sessions=[

        "Customer Service Refresher",

        "Refund Policies",

        "Flight Disruptions",

        "Ancillaries"

    ];

    return(

        <div className="rounded-3xl bg-white shadow-xl p-8">

            <h2 className="text-2xl font-bold text-red-700 mb-6">

                Upcoming Training

            </h2>

            <div className="space-y-4">

                {sessions.map(session=>(

                    <div
                    key={session}
                    className="rounded-xl border border-gray-200 p-4 hover:bg-red-50">

                        <h3 className="font-semibold">

                            {session}

                        </h3>

                        <p className="text-gray-500">

                            July 2026

                        </p>

                    </div>

                ))}

            </div>

        </div>

    );

}