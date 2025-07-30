import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ArrowLeft, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import Head from "next/head";


const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const router = useRouter();
  const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
  

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }
  }, [token, router]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log("Bookings data:", data);
        console.log("Response status:", res.status);
        console.log("Response ok:", res.ok);
        if (res.ok) {
          // Map bookings to FullCalendar event objects
          const bookings = Array.isArray(data) ? data : (data.bookings || []);
          const events = bookings.map((b) => {
            // Prefer start_time if available, else fallback to b.time or just date
            let startTime = b.start_time || b.time || '';
            let start = b.date; // Keep the original ISO date

            if (startTime) {
              // Create a Date object from the ISO date, then set the time components
              const dateObj = new Date(b.date);
              const [hours, minutes, seconds] = startTime.split(':').map(Number);
              dateObj.setHours(hours, minutes, seconds);
              start = dateObj.toISOString(); // Convert back to ISO string for FullCalendar
            }
            
            // Compose event title and description
            const serviceName = b.service?.name || '';
            const clientName = b.client?.user?.display_name || b.client?.user?.username || '';
            const providerName = b.provider?.user?.display_name || b.provider?.user?.username || '';
            const status = b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1) : '';
            const note = b.notes || b.note || '';
            console.log(`Booking ${b.id}: status="${b.status}"`);
            return {
              title: b.title || serviceName || "Booking",
              start,
              extendedProps: {
                ...b,
                serviceName,
                clientName,
                providerName,
                status: b.status,
                note
              },
              backgroundColor: b.status === "approved" ? "#10B981" : b.status === "pending" ? "#F59E0B" : b.status === "finished" ? "#3B82F6" : b.status === "cancelled" ? "#EF4444" : b.status === "declined" ? "#6B7280" : "#6B7280",
              borderColor: "#1F2937",
              textColor: "#fff"
            };
          });
          console.log("Mapped events:", events);
          console.log("Events count:", events.length);
          setEvents(events);
        } else {
          console.error("Failed to fetch bookings:", res.status, data);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };
    if (token) fetchBookings();
  }, [token]);

  // Custom event content for tooltip/info
  function renderEventContent(eventInfo) {
    const b = eventInfo.event.extendedProps;
    const time = b.start_time || b.time || '';
    const status = b.status || '';
    const service = b.serviceName || '';
    const client = b.clientName || '';
    const provider = b.providerName || '';
    
    // Format time display
    const formattedTime = time ? formatTime(time) : '';
    
    // Get status badge styles
    const getStatusStyles = (status) => {
      switch(status) {
        case 'approved': return { bg: '#22c55e', text: '#fff' };
        case 'pending': return { bg: '#f59e42', text: '#fff' };
        case 'finished': return { bg: '#5275e0', text: '#fff' };
        case 'cancelled': return { bg: '#ef4444', text: '#fff' };
        case 'declined': return { bg: '#6b7280', text: '#fff' };
        default: return { bg: '#6b7280', text: '#fff' };
      }
    };
    
    const statusStyles = getStatusStyles(status);
    
    return (
      <div className="p-1" style={{ fontSize: '11px', lineHeight: 1.2 }}>
        <div className="font-semibold text-white mb-1 truncate" style={{ fontSize: '12px' }}>
          {eventInfo.event.title}
        </div>
        
        {formattedTime && (
          <div className="text-gray-300 mb-1 flex items-center">
            <span className="text-xs">🕐</span>
            <span className="ml-1">{formattedTime}</span>
          </div>
        )}
        
        {service && (
          <div className="text-blue-300 mb-1 truncate" style={{ fontSize: '10px' }}>
            {service}
          </div>
        )}
        
        {(client || provider) && (
          <div className="text-gray-400 truncate" style={{ fontSize: '10px' }}>
            {client ? `Client: ${client}` : `Provider: ${provider}`}
          </div>
        )}
        
        {status && (
          <div 
            className="inline-block px-1 py-0.5 rounded text-xs font-medium mt-1"
            style={{ 
              backgroundColor: statusStyles.bg, 
              color: statusStyles.text,
              fontSize: '9px'
            }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        )}
      </div>
    );
  }
  
  // Helper function to format time
  function formatTime(timeString) {
    if (!timeString) return '';
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  }

  return (
    <div className='bg-[#0B0C0E] text-white flex flex-col items-center w-full min-h-screen'>
      <Head>
        <title>Calendar - Bookings</title>
        <meta name="description" content="View your bookings in calendar format" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ===== HEADER BAR ===== */}
      <header className="w-[90vw] max-w-7xl pb-5 pt-10 mx-auto border-b border-[#22252A] flex flex-row items-center justify-center text-center">
        <button className='basis-2/100 w-8 cursor-pointer mr-4' onClick={() => router.back()}>
          <ArrowLeft size={20} color='white' />
        </button>
        <p className='font-normal text-lg leading-7 text-white basis-90/100 text-left'>
          Calendar
        </p>
      </header>

      {/* ===== APPOINTMENTS COUNT ===== */}
      <div className='flex items-center justify-center my-6 w-[90vw] max-w-7xl'>
        <div className='flex items-center'>
          <Calendar size={20} className='text-[#9CA3AF]' />
          <span className='text-[#9CA3AF] text-[13px] ml-2'>
            {events.length} Appointments
          </span>
        </div>
      </div>

      {/* ===== CALENDAR ===== */}
      <div className="w-[90vw] max-w-7xl bg-[#16171A] rounded-lg border border-[#22252A] p-2 sm:p-4 mb-6">
        <style>{`
          .fc {
            background: transparent !important;
            color: #fff !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          
          .fc .fc-view-harness {
            background: transparent !important;
          }
          
          .fc .fc-col-header {
            background: #0B0C0E !important;
            border-color: #22252A !important;
          }
          
          .fc .fc-col-header-cell {
            background: #0B0C0E !important;
            border-color: #22252A !important;
            color: #9CA3AF !important;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 12px 8px;
          }
          
          .fc .fc-daygrid-day {
            background: transparent !important;
            border-color: #22252A !important;
          }
          
          .fc .fc-daygrid-day-number {
            color: #fff !important;
            font-weight: 500;
            padding: 8px;
            font-size: 14px;
          }
          
          .fc .fc-daygrid-day.fc-day-today {
            background: rgba(82, 117, 224, 0.1) !important;
            border-color: #5275e0 !important;
          }
          
          .fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
            color: #5275e0 !important;
            font-weight: 700;
          }
          
          .fc .fc-toolbar {
            margin: 0 0 20px 0 !important;
          }
          
          .fc .fc-toolbar-title {
            color: #fff !important;
            font-size: 20px !important;
            font-weight: 600 !important;
          }
          
          .fc .fc-button {
            background: #22252A !important;
            color: #fff !important;
            border: 1px solid #2E2F31 !important;
            border-radius: 6px !important;
            padding: 8px 12px !important;
            font-size: 13px !important;
            font-weight: 500 !important;
            transition: all 0.2s ease !important;
            box-shadow: none !important;
          }
          
          .fc .fc-button:hover {
            background: #2E2F31 !important;
            border-color: #3A3B3D !important;
            transform: translateY(-1px);
          }
          
          .fc .fc-button-primary:not(:disabled).fc-button-active, 
          .fc .fc-button-primary:not(:disabled):active {
            background: #5275e0 !important;
            border-color: #5275e0 !important;
            color: white !important;
          }
          
          .fc .fc-event {
            border-radius: 4px !important;
            border: none !important;
            padding: 2px 6px !important;
            margin: 1px 0 !important;
            font-size: 11px !important;
            font-weight: 500 !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
          }
          
          .fc .fc-event:hover {
            transform: translateY(-1px) !important;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4) !important;
          }
          
          .fc .fc-daygrid-more-link {
            color: #5275e0 !important;
            font-size: 11px !important;
            font-weight: 500 !important;
          }
          
          .fc .fc-popover {
            background: #16171A !important;
            border: 1px solid #22252A !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
          }
          
          .fc .fc-popover-header {
            background: #0B0C0E !important;
            color: #fff !important;
            border-bottom: 1px solid #22252A !important;
            padding: 12px !important;
            font-weight: 600 !important;
          }
          
          .fc .fc-popover-body {
            background: #16171A !important;
            color: #fff !important;
            padding: 8px !important;
          }
          
          .fc .fc-daygrid-day-events {
            margin-top: 4px;
          }
          
          .fc .fc-h-event {
            background: transparent !important;
          }
          
          .fc .fc-daygrid-event-harness {
            margin: 1px 2px !important;
          }
          
          .fc .fc-toolbar-chunk {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          /* Mobile Responsive Styles */
          @media (max-width: 640px) {
            .fc .fc-toolbar {
              flex-direction: column !important;
              gap: 12px !important;
            }
            
            .fc .fc-toolbar-chunk {
              justify-content: center !important;
            }
            
            .fc .fc-button {
              padding: 6px 8px !important;
              font-size: 12px !important;
            }
            
            .fc .fc-toolbar-title {
              font-size: 18px !important;
              text-align: center !important;
            }
            
            .fc .fc-daygrid-day-number {
              font-size: 12px !important;
              padding: 4px !important;
            }
            
            .fc .fc-col-header-cell {
              padding: 8px 4px !important;
              font-size: 10px !important;
            }
            
            .fc .fc-event {
              font-size: 10px !important;
              padding: 1px 4px !important;
            }
            
            .fc .fc-daygrid-event-harness {
              margin: 0.5px 1px !important;
            }
            
            .fc .fc-popover {
              margin: 10px !important;
              max-width: calc(100vw - 20px) !important;
            }
          }
          
          @media (max-width: 480px) {
            .fc .fc-toolbar-title {
              font-size: 16px !important;
            }
            
            .fc .fc-button {
              padding: 4px 6px !important;
              font-size: 11px !important;
            }
            
            .fc .fc-col-header-cell {
              font-size: 9px !important;
              padding: 6px 2px !important;
            }
            
            .fc .fc-daygrid-day-number {
              font-size: 11px !important;
              padding: 2px !important;
            }
          }
        `}</style>
        
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          events={events}
          eventContent={renderEventContent}
          eventDataTransform={event => ({ ...event, display: 'block' })}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: ""
          }}
          dayMaxEvents={3}
          fixedWeekCount={false}
          dayMaxEventRows={3}
          moreLinkClick="popover"
          eventDisplay="block"
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }}
        />
      </div>
    </div>
  );
};

export default CalendarPage;