import React, { useState, useEffect } from 'react';
import { getEvent } from '@src/api/event/getEvent';
import { Event } from '@src/api/event/event';
import registrationApi from '@src/api/registration';

interface MultiRegistrationProps {
  eventIds: string[];
  darkMode?: boolean;
  onRegistrationComplete?: (joinCodes: { eventId: string; joinCode: string }[]) => void;
}

interface EventWithId extends Event {
  id: string;
}

export const MultiRegistration: React.FC<MultiRegistrationProps> = ({
  eventIds,
  darkMode = false,
  onRegistrationComplete,
}) => {
  const [events, setEvents] = useState<EventWithId[]>([]);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  // Fetch all events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Limit to 3 events
        const limitedEventIds = eventIds.slice(0, 3);
        
        const eventPromises = limitedEventIds.map(async (id) => {
          const event = await getEvent(id);
          return { ...event, id } as EventWithId;
        });
        
        const fetchedEvents = await Promise.all(eventPromises);
        setEvents(fetchedEvents);
        
        // Automatically select the first event by default
        if (fetchedEvents.length > 0) {
          setSelectedEventIds([fetchedEvents[0].id]);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (eventIds && eventIds.length > 0) {
      fetchEvents();
    } else {
      setLoading(false);
      setError('No event IDs provided.');
    }
  }, [eventIds]);

  const handleEventToggle = (eventId: string) => {
    setSelectedEventIds((prev) => {
      if (prev.includes(eventId)) {
        return prev.filter((id) => id !== eventId);
      } else {
        return [...prev, eventId];
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedEventIds.length === 0) {
      setRegistrationError('Please select at least one event to register for.');
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email) {
      setRegistrationError('Please fill in all fields.');
      return;
    }

    setIsRegistering(true);
    setRegistrationError(null);

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      
      // Register for all selected events
      const registrationPromises = selectedEventIds.map(async (eventId) => {
        const response = await registrationApi.registerUser({
          name: fullName,
          email: formData.email,
          eventId,
        });
        return { eventId, joinCode: response.joinCode };
      });

      const results = await Promise.all(registrationPromises);
      
      setRegistrationSuccess(true);
      
      if (onRegistrationComplete) {
        onRegistrationComplete(results);
      }
    } catch (err) {
      console.error('Error registering user:', err);
      setRegistrationError('Failed to complete registration. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center p-8 min-h-screen ${darkMode ? 'dark bg-black' : 'bg-white'}`}>
        <div className="text-black dark:text-white">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex justify-center items-center p-8 min-h-screen ${darkMode ? 'dark bg-black' : 'bg-white'}`}>
        <div className="text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  const displayedEvent = selectedEventIds.length > 0 
    ? events.find((e) => e.id === selectedEventIds[selectedEventIds.length - 1]) 
    : null;

  return (
    <div className={`font-['Inter'] min-h-screen ${darkMode ? 'dark bg-black' : 'bg-white'}`}>
      <div className="container mx-auto px-4 py-6" style={{ maxWidth: '1400px' }}>
        {registrationSuccess ? (
          <div className="flex flex-col items-center justify-center min-h-[500px] gap-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-black dark:text-white">Registration Successful!</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 text-center max-w-md">
              You have been successfully registered for {selectedEventIds.length} event{selectedEventIds.length > 1 ? 's' : ''}. 
              Check your email for confirmation and event details.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Multi-select and Registration Form */}
            <div className="flex flex-col gap-6">
              {/* Event Multi-select */}
              <div>
                <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Select Events</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Choose up to {events.length} event{events.length > 1 ? 's' : ''} you'd like to register for:
                </p>
                <div className="space-y-3">
                  {events.map((event) => (
                    <label
                      key={event.id}
                      className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedEventIds.includes(event.id)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                          : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedEventIds.includes(event.id)}
                        onChange={() => handleEventToggle(event.id)}
                        className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-black dark:text-white">{event.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {formatDate(event.startDate)} • {formatTime(event.startDate)}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Registration Form */}
              <div className="border-t pt-6 dark:border-gray-700 pb-8">
                <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Your Information</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-black dark:text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-black dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-black dark:text-white"
                    />
                  </div>
                  
                  {registrationError && (
                    <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                      {registrationError}
                    </div>
                  )}

                  {selectedEventIds.length === 0 && (
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-800 rounded-lg text-yellow-700 dark:text-yellow-400 text-sm">
                      ⚠️ Please select at least one event to register
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isRegistering || selectedEventIds.length === 0}
                    style={{
                      backgroundColor: isRegistering || selectedEventIds.length === 0 ? '#9CA3AF' : '#2563EB',
                      color: '#FFFFFF',
                    }}
                    className="w-full px-6 py-3 text-lg font-semibold hover:opacity-90 disabled:cursor-not-allowed text-white rounded-lg transition-all shadow-lg hover:shadow-xl disabled:shadow-none block border-0"
                    onMouseEnter={(e) => {
                      if (!isRegistering && selectedEventIds.length > 0) {
                        e.currentTarget.style.backgroundColor = '#1D4ED8';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isRegistering && selectedEventIds.length > 0) {
                        e.currentTarget.style.backgroundColor = '#2563EB';
                      }
                    }}
                  >
                    {isRegistering ? (
                      <span className="flex items-center justify-center gap-2" style={{ color: '#FFFFFF' }}>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span style={{ color: '#FFFFFF' }}>Registering...</span>
                      </span>
                    ) : selectedEventIds.length === 0 ? (
                      <span style={{ color: '#FFFFFF' }}>Select Events to Register</span>
                    ) : (
                      <span style={{ color: '#FFFFFF' }}>Register for {selectedEventIds.length} Event{selectedEventIds.length !== 1 ? 's' : ''} →</span>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Side - Event Details */}
            <div className="lg:sticky lg:top-6">
              {displayedEvent ? (
                <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                  {/* Event Banner */}
                  {displayedEvent.picture && (
                    <div className="w-full bg-gray-200 dark:bg-gray-800">
                      <img
                        src={displayedEvent.picture}
                        alt={displayedEvent.name}
                        style={{ 
                          width: '100%',
                          height: 'auto',
                          display: 'block'
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    {/* Title */}
                    <h1 className="text-3xl font-bold text-black dark:text-white mb-4">
                      {displayedEvent.name}
                    </h1>

                    {/* Date and Time */}
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-6">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>
                        {formatDate(displayedEvent.startDate)} • {formatTime(displayedEvent.startDate)}
                        {displayedEvent.timezone && ` ${displayedEvent.timezone}`}
                      </span>
                    </div>

                    {/* Description */}
                    {(displayedEvent.description || displayedEvent.agenda?.schedule?.[0]?.content) && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-2">About This Event</h3>
                        <div 
                          className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ 
                            __html: displayedEvent.description || displayedEvent.agenda?.schedule?.[0]?.content || ''
                          }}
                        />
                      </div>
                    )}

                    {/* Key Points */}
                    {displayedEvent.agenda?.schedule?.[0]?.list && displayedEvent.agenda.schedule[0].list.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-2">What You'll Learn</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                          {displayedEvent.agenda.schedule[0].list.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Speaker Info */}
                    {displayedEvent.agenda?.schedule?.[0]?.supheading && (
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Speaker</h3>
                        <div className="flex items-center gap-3">
                          <img
                            src="https://i.pravatar.cc/150?img=12"
                            alt="Speaker"
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                          />
                          <div>
                            <p className="font-medium text-black dark:text-white">
                              {displayedEvent.agenda.schedule[0].supheading}
                            </p>
                            {displayedEvent.agenda.schedule[0].heading && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {displayedEvent.agenda.schedule[0].heading}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-12 bg-white dark:bg-gray-900 flex flex-col items-center justify-center text-center">
                  <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Select an event to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

