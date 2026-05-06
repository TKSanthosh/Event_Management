require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');

const User = require('../models/User');
const Venue = require('../models/Venue');
const Organizer = require('../models/Organizer');
const Event = require('../models/Event');
const Attendee = require('../models/Attendee');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Promise.all([
      User.deleteMany({}),
      Venue.deleteMany({}),
      Organizer.deleteMany({}),
      Event.deleteMany({}),
      Attendee.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
    });
    console.log('Created admin user');

    const venues = await Venue.insertMany([
      {
        name: 'Chennai Trade Centre',
        address: 'Nandambakkam, Mount Poonamallee Road',
        city: 'Chennai',
        capacity: 1200,
      },
      {
        name: 'Hotel Sangam Convention Hall',
        address: 'Collector Office Road, Srinivasa Nagar',
        city: 'Trichy',
        capacity: 400,
      },
      {
        name: 'Madurai Kamaraj University Auditorium',
        address: 'Palkalai Nagar, Madurai',
        city: 'Madurai',
        capacity: 600,
      },
      {
        name: 'Salem Steel Plant Community Hall',
        address: 'Fairlands, Steel Plant Road',
        city: 'Salem',
        capacity: 300,
      },
      {
        name: 'Codissia Trade Fair Complex',
        address: 'Avinashi Road, Peelamedu',
        city: 'Coimbatore',
        capacity: 800,
      },
      {
        name: 'VOC Park Auditorium',
        address: 'VOC Park, Beach Road',
        city: 'Tuticorin',
        capacity: 250,
      },
    ]);
    console.log(`Created ${venues.length} venues`);

    const organizers = await Organizer.insertMany([
      {
        name: 'Kanmani S',
        email: 'kanmani@eventzpro.com',
        phone: '+91 98401 11223',
        organizationName: 'EventzPro',
      },
      {
        name: 'Prathosh R',
        email: 'prathosh@techsummits.com',
        phone: '+91 99401 44556',
        organizationName: 'TechSummits',
      },
      {
        name: 'Santhosh TK',
        email: 'santhosh@nextevent.com',
        phone: '+91 98841 77889',
        organizationName: 'NextEvent Solutions',
      },
      {
        name: 'Kannan M',
        email: 'kannan@bizconclaves.com',
        phone: '+91 97891 00112',
        organizationName: 'Biz Conclaves',
      },
    ]);
    console.log(`Created ${organizers.length} organizers`);

    const events = await Event.insertMany([
      {
        title: 'Tech Summit 2025',
        description: 'Premier technology conference covering AI, cloud computing, and DevOps trends.',
        date: new Date('2025-09-20'),
        startTime: '09:00',
        endTime: '18:00',
        venue: venues[0]._id,
        organizer: organizers[1]._id,
        maxAttendees: 800,
        attendeesCount: 0,
        status: 'upcoming',
      },
      {
        title: 'UX & Product Design Workshop',
        description: 'Hands-on workshop on modern UX/UI design principles and product thinking.',
        date: new Date('2025-08-15'),
        startTime: '10:00',
        endTime: '16:00',
        venue: venues[4]._id,
        organizer: organizers[0]._id,
        maxAttendees: 120,
        attendeesCount: 0,
        status: 'upcoming',
      },
      {
        title: 'Startup Founders Conclave',
        description: 'Networking event for founders, investors, and ecosystem leaders.',
        date: new Date('2025-10-05'),
        startTime: '11:00',
        endTime: '19:00',
        venue: venues[1]._id,
        organizer: organizers[3]._id,
        maxAttendees: 300,
        attendeesCount: 0,
        status: 'upcoming',
      },
      {
        title: 'Digital Marketing Bootcamp',
        description: 'Intensive bootcamp on SEO, social media strategy, and performance marketing.',
        date: new Date('2025-07-12'),
        startTime: '09:30',
        endTime: '17:30',
        venue: venues[2]._id,
        organizer: organizers[0]._id,
        maxAttendees: 200,
        attendeesCount: 0,
        status: 'upcoming',
      },
      {
        title: 'HR & Leadership Summit',
        description: 'Summit focused on people management, leadership skills, and workplace culture.',
        date: new Date('2025-11-22'),
        startTime: '09:00',
        endTime: '17:00',
        venue: venues[3]._id,
        organizer: organizers[2]._id,
        maxAttendees: 250,
        attendeesCount: 0,
        status: 'upcoming',
      },
      {
        title: 'Cybersecurity Awareness Workshop',
        description: 'Practical workshop on data security, ethical hacking basics, and threat prevention.',
        date: new Date('2025-06-28'),
        startTime: '10:00',
        endTime: '15:00',
        venue: venues[5]._id,
        organizer: organizers[1]._id,
        maxAttendees: 150,
        attendeesCount: 0,
        status: 'upcoming',
      },
      {
        title: 'Annual Business Awards Night',
        description: 'Recognizing outstanding businesses and entrepreneurs of the year.',
        date: new Date('2025-02-14'),
        startTime: '18:00',
        endTime: '22:00',
        venue: venues[0]._id,
        organizer: organizers[3]._id,
        maxAttendees: 500,
        attendeesCount: 0,
        status: 'completed',
      },
      {
        title: 'Women in Tech Conference',
        description: 'Celebrating and empowering women in technology and leadership roles.',
        date: new Date('2025-03-08'),
        startTime: '09:00',
        endTime: '17:00',
        venue: venues[2]._id,
        organizer: organizers[0]._id,
        maxAttendees: 350,
        attendeesCount: 0,
        status: 'completed',
      },
    ]);
    console.log(`Created ${events.length} events`);

    const attendees = await Attendee.insertMany([
      { name: 'Santhosh K',  email: 'santhosh.k@example.com',  phone: '+91 98765 43210', registeredEvents: [] },
      { name: 'Kannan M',    email: 'kannan.m@example.com',    phone: '+91 87654 32109', registeredEvents: [] },
      { name: 'Prathosh S',  email: 'prathosh.s@example.com',  phone: '+91 76543 21098', registeredEvents: [] },
      { name: 'Kanmani V',   email: 'kanmani.v@example.com',   phone: '+91 96321 54870', registeredEvents: [] },
      { name: 'Aravind R',   email: 'aravind.r@example.com',   phone: '+91 94432 10987', registeredEvents: [] },
      { name: 'Deepa T',     email: 'deepa.t@example.com',     phone: '+91 98901 23456', registeredEvents: [] },
      { name: 'Murugan P',   email: 'murugan.p@example.com',   phone: '+91 77891 34567', registeredEvents: [] },
      { name: 'Kavitha N',   email: 'kavitha.n@example.com',   phone: '+91 86754 90123', registeredEvents: [] },
      { name: 'Selvam J',    email: 'selvam.j@example.com',    phone: '+91 99012 45678', registeredEvents: [] },
      { name: 'Priya L',     email: 'priya.l@example.com',     phone: '+91 90123 56789', registeredEvents: [] },
    ]);
    console.log(`Created ${attendees.length} attendees`);

    const registrations = [
      { attendeeIdx: 0, eventIdx: 0 },
      { attendeeIdx: 1, eventIdx: 0 },
      { attendeeIdx: 2, eventIdx: 1 },
      { attendeeIdx: 3, eventIdx: 1 },
      { attendeeIdx: 4, eventIdx: 2 },
      { attendeeIdx: 5, eventIdx: 3 },
      { attendeeIdx: 6, eventIdx: 3 },
      { attendeeIdx: 7, eventIdx: 4 },
      { attendeeIdx: 8, eventIdx: 5 },
      { attendeeIdx: 9, eventIdx: 0 },
      { attendeeIdx: 0, eventIdx: 2 },
    ];

    for (const { attendeeIdx, eventIdx } of registrations) {
      const attendee = attendees[attendeeIdx];
      const event = events[eventIdx];

      attendee.registeredEvents.push(event._id);
      await attendee.save();

      event.attendees.push(attendee._id);
      event.attendeesCount += 1;
      await event.save();
    }

    console.log(`Created ${registrations.length} registrations`);
    console.log('\nSeed completed successfully!');
    console.log('Login credentials: admin@example.com / password123');
  } catch (error) {
    console.error('Seed failed:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
