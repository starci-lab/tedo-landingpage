/**
 * Circuit traces flanking the hero, each carrying a light pulse.
 *
 * The traces are kept out of the middle band (x 360–1080) on purpose — that is
 * where the headline and subtitle sit, and a moving highlight behind running
 * text is the fastest way to make copy unreadable.
 *
 * Every path declares `pathLength="100"`, which normalises dash units so one
 * set of dash values animates correctly on paths of wildly different real
 * lengths. Without it each trace would need its own hand-measured dasharray.
 */

/**
 * Delays are spread so they land on different phases of BOTH the 5.6s travel
 * and the 2.9s glow — multiples of either would make traces swell in unison
 * and read as one blinking object instead of six independent ones.
 */
const TRACES = [
    { d: "M0 130 H120 L168 178 V430 L200 462 H330", delay: "0s" },
    { d: "M0 250 H72 L120 298 V568 H250", delay: "0.9s" },
    { d: "M0 392 H48 L96 440 V312 L140 268 H310", delay: "1.7s" },
    { d: "M1440 150 H1320 L1272 198 V450 L1240 482 H1110", delay: "2.6s" },
    { d: "M1440 310 H1368 L1320 358 V612 H1190", delay: "3.4s" },
    { d: "M1440 492 H1392 L1344 540 V372 L1300 328 H1150", delay: "4.3s" },
]

const VIAS = [
    [330, 462],
    [250, 568],
    [310, 268],
    [1110, 482],
    [1190, 612],
    [1150, 328],
]

export function CircuitTraces() {
    return (
        <svg
            aria-hidden
            className="tedo-circuit absolute inset-0 h-full w-full"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMin slice"
            fill="none"
        >
            {TRACES.map((trace) => (
                <path
                    key={trace.d}
                    d={trace.d}
                    pathLength={100}
                    className="tedo-trace-base"
                />
            ))}

            {VIAS.map(([cx, cy]) => (
                <circle
                    key={`${cx}-${cy}`}
                    cx={cx}
                    cy={cy}
                    r={4}
                    className="tedo-via"
                />
            ))}

            {TRACES.map((trace) => (
                <path
                    key={`pulse-${trace.d}`}
                    d={trace.d}
                    pathLength={100}
                    className="tedo-trace-pulse"
                    style={{ animationDelay: trace.delay }}
                />
            ))}
        </svg>
    )
}
