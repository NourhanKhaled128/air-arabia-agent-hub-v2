export default function Hero() {

  return (

    <section className="relative mt-8 overflow-hidden rounded-3xl">

      <img
        src="/images/plane.jpg"
        alt="Plane"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-red-900/90 via-red-800/70 to-red-700/30"></div>

      <div className="relative z-10 flex min-h-[300px] items-center justify-between px-12 py-10">

        <div className="max-w-2xl">

          <span className="rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur">

            Internal Knowledge Portal

          </span>

          <h1 className="mt-5 text-5xl font-bold text-white">

            Air Arabia Agent Hub

          </h1>

          <p className="mt-5 text-xl leading-9 text-white">

            Access procedures, reservation guides,
            airport operations, refund policies,
            baggage information and AirRewards documentation.

          </p>

          <div className="mt-8 flex gap-4">

            <button className="rounded-xl bg-white px-6 py-3 font-semibold text-red-700 hover:bg-red-100">

              Browse Articles

            </button>

            <button className="rounded-xl border border-white px-6 py-3 font-semibold text-white hover:bg-white hover:text-red-700">

              Latest Updates

            </button>

          </div>

        </div>

        <div className="hidden xl:block">

          <div className="rounded-3xl bg-white/10 p-8 backdrop-blur-lg">

            <h2 className="mb-6 text-2xl font-bold text-white">

              Dashboard

            </h2>

            <div className="space-y-5 text-white">

              <div className="flex justify-between gap-20">

                <span>Articles</span>

                <strong>145</strong>

              </div>

              <div className="flex justify-between">

                <span>Categories</span>

                <strong>12</strong>

              </div>

              <div className="flex justify-between">

                <span>Airport Alerts</span>

                <strong>2</strong>

              </div>

              <div className="flex justify-between">

                <span>Recent Updates</span>

                <strong>8</strong>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>

  );
}