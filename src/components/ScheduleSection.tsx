const schedule = [
  {
    day: "DAY 1",
    date: "MARCH 6",
    events: [
      { time: "09:00", title: "Registration Opens", description: "Check-in and badge pickup" },
      { time: "10:00", title: "Opening Ceremony", description: "Welcome address and sponsor introductions" },
      { time: "11:00", title: "Team Formation", description: "Find your squad or finalize teams" },
      { time: "12:00", title: "Hacking Begins", description: "Let the chaos commence" },
      { time: "14:00", title: "Workshop: AI APIs", description: "Hands-on session with OpenAI & more" },
      { time: "20:00", title: "Mentor Hours", description: "Get guidance from industry experts" },
    ],
  },
  {
    day: "DAY 2",
    date: "MARCH 7",
    events: [
      { time: "00:00", title: "Midnight Pizza", description: "Fuel up for the night ahead" },
      { time: "08:00", title: "Breakfast", description: "Start fresh with coffee and code" },
      { time: "10:00", title: "Workshop: Pitching", description: "How to present like a pro" },
      { time: "15:00", title: "Check-in Point", description: "Progress update with organizers" },
      { time: "18:00", title: "Mini Games", description: "Take a break, win some swag" },
      { time: "23:00", title: "Final Sprint", description: "Last push before deadline" },
    ],
  },
  {
    day: "DAY 3",
    date: "MARCH 8",
    events: [
      { time: "09:00", title: "Submissions Close", description: "All projects must be submitted" },
      { time: "10:00", title: "Judging Begins", description: "Demos to expert panel" },
      { time: "14:00", title: "Closing Ceremony", description: "Winners announced, prizes awarded" },
      { time: "16:00", title: "Networking", description: "Connect with sponsors and hackers" },
    ],
  },
];

const ScheduleSection = () => {
  return (
    <section id="schedule" className="relative py-24 md:py-32 bg-charcoal">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />

      <div className="container px-6 relative">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="font-mono text-sm text-primary tracking-[0.3em]">// TIMELINE</span>
          <h2 className="font-display text-5xl md:text-6xl text-foreground mt-4">
            THE <span className="text-primary">SCHEDULE</span>
          </h2>
        </div>

        {/* Schedule grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {schedule.map((day, dayIndex) => (
            <div key={dayIndex} className="relative">
              {/* Day header */}
              <div className="sticky top-20 bg-charcoal/90 backdrop-blur-sm py-4 mb-6 z-10 border-b border-border">
                <div className="font-display text-3xl text-primary">{day.day}</div>
                <div className="font-mono text-sm text-muted-foreground">{day.date}</div>
              </div>

              {/* Events */}
              <div className="space-y-4">
                {day.events.map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className="group relative pl-6 border-l-2 border-border hover:border-primary transition-colors"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-0 w-3 h-3 -translate-x-[7px] bg-background border-2 border-border group-hover:border-primary group-hover:bg-primary transition-colors" />

                    {/* Event content */}
                    <div className="pb-6">
                      <div className="font-mono text-xs text-primary mb-1">{event.time}</div>
                      <h4 className="font-display text-lg text-foreground group-hover:text-primary transition-colors">
                        {event.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;
