--
-- PostgreSQL database dump
--

\restrict ZoycJCK1RvjW79VZUmXUvWYffk6tbNKTKzDrtXGgZNHmMMNd6H44PtIArImrNo6

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-03-11 12:27:36

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 875 (class 1247 OID 24652)
-- Name: booking_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.booking_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);


ALTER TYPE public.booking_status OWNER TO postgres;

--
-- TOC entry 878 (class 1247 OID 24660)
-- Name: maintenance_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.maintenance_status AS ENUM (
    'scheduled',
    'completed',
    'cancelled'
);


ALTER TYPE public.maintenance_status OWNER TO postgres;

--
-- TOC entry 872 (class 1247 OID 24643)
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'user',
    'approver',
    'maintenance'
);


ALTER TYPE public.user_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 231 (class 1259 OID 24768)
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    booking_id integer NOT NULL,
    resource_id integer NOT NULL,
    user_id integer NOT NULL,
    start_datetime timestamp without time zone NOT NULL,
    end_datetime timestamp without time zone NOT NULL,
    status public.booking_status DEFAULT 'pending'::public.booking_status,
    approver_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    approved_at timestamp(6) without time zone,
    event_name character varying(255),
    CONSTRAINT bookings_check CHECK ((start_datetime < end_datetime))
);


ALTER TABLE public.bookings OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 24767)
-- Name: bookings_booking_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bookings_booking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookings_booking_id_seq OWNER TO postgres;

--
-- TOC entry 5165 (class 0 OID 0)
-- Dependencies: 230
-- Name: bookings_booking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bookings_booking_id_seq OWNED BY public.bookings.booking_id;


--
-- TOC entry 224 (class 1259 OID 24696)
-- Name: buildings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.buildings (
    building_id integer NOT NULL,
    building_name character varying(100) NOT NULL,
    building_number character varying(50) NOT NULL,
    total_floors integer NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.buildings OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 24695)
-- Name: buildings_building_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.buildings_building_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.buildings_building_id_seq OWNER TO postgres;

--
-- TOC entry 5166 (class 0 OID 0)
-- Dependencies: 223
-- Name: buildings_building_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.buildings_building_id_seq OWNED BY public.buildings.building_id;


--
-- TOC entry 235 (class 1259 OID 24818)
-- Name: cupboards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cupboards (
    cupboard_id integer NOT NULL,
    resource_id integer NOT NULL,
    cupboard_name character varying(100) NOT NULL,
    total_shelves integer NOT NULL
);


ALTER TABLE public.cupboards OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 24817)
-- Name: cupboards_cupboard_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cupboards_cupboard_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cupboards_cupboard_id_seq OWNER TO postgres;

--
-- TOC entry 5167 (class 0 OID 0)
-- Dependencies: 234
-- Name: cupboards_cupboard_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cupboards_cupboard_id_seq OWNED BY public.cupboards.cupboard_id;


--
-- TOC entry 228 (class 1259 OID 24740)
-- Name: facility_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.facility_master (
    facility_id integer NOT NULL,
    facility_name character varying(100) NOT NULL
);


ALTER TABLE public.facility_master OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 24739)
-- Name: facility_master_facility_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.facility_master_facility_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.facility_master_facility_id_seq OWNER TO postgres;

--
-- TOC entry 5168 (class 0 OID 0)
-- Dependencies: 227
-- Name: facility_master_facility_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.facility_master_facility_id_seq OWNED BY public.facility_master.facility_id;


--
-- TOC entry 233 (class 1259 OID 24798)
-- Name: maintenance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.maintenance (
    maintenance_id integer NOT NULL,
    resource_id integer NOT NULL,
    maintenance_type character varying(100) NOT NULL,
    scheduled_date date NOT NULL,
    status public.maintenance_status DEFAULT 'scheduled'::public.maintenance_status,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    completed_at timestamp(6) without time zone,
    completed_by integer,
    created_by integer
);


ALTER TABLE public.maintenance OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 24797)
-- Name: maintenance_maintenance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.maintenance_maintenance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.maintenance_maintenance_id_seq OWNER TO postgres;

--
-- TOC entry 5169 (class 0 OID 0)
-- Dependencies: 232
-- Name: maintenance_maintenance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.maintenance_maintenance_id_seq OWNED BY public.maintenance.maintenance_id;


--
-- TOC entry 239 (class 1259 OID 32887)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    notification_id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    type character varying(50) DEFAULT 'info'::character varying NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 32886)
-- Name: notifications_notification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_notification_id_seq OWNER TO postgres;

--
-- TOC entry 5170 (class 0 OID 0)
-- Dependencies: 238
-- Name: notifications_notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_notification_id_seq OWNED BY public.notifications.notification_id;


--
-- TOC entry 229 (class 1259 OID 24750)
-- Name: resource_facilities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resource_facilities (
    resource_id integer NOT NULL,
    facility_id integer NOT NULL
);


ALTER TABLE public.resource_facilities OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 24685)
-- Name: resource_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resource_types (
    resource_type_id integer NOT NULL,
    type_name character varying(100) NOT NULL
);


ALTER TABLE public.resource_types OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24684)
-- Name: resource_types_resource_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.resource_types_resource_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resource_types_resource_type_id_seq OWNER TO postgres;

--
-- TOC entry 5171 (class 0 OID 0)
-- Dependencies: 221
-- Name: resource_types_resource_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.resource_types_resource_type_id_seq OWNED BY public.resource_types.resource_type_id;


--
-- TOC entry 226 (class 1259 OID 24711)
-- Name: resources; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resources (
    resource_id integer NOT NULL,
    resource_name character varying(100) NOT NULL,
    resource_type_id integer NOT NULL,
    building_id integer NOT NULL,
    floor_number integer NOT NULL,
    capacity integer,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.resources OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 24710)
-- Name: resources_resource_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.resources_resource_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resources_resource_id_seq OWNER TO postgres;

--
-- TOC entry 5172 (class 0 OID 0)
-- Dependencies: 225
-- Name: resources_resource_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.resources_resource_id_seq OWNED BY public.resources.resource_id;


--
-- TOC entry 237 (class 1259 OID 24834)
-- Name: shelves; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shelves (
    shelf_id integer NOT NULL,
    cupboard_id integer NOT NULL,
    shelf_number integer NOT NULL,
    capacity integer,
    description text
);


ALTER TABLE public.shelves OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 24833)
-- Name: shelves_shelf_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shelves_shelf_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shelves_shelf_id_seq OWNER TO postgres;

--
-- TOC entry 5173 (class 0 OID 0)
-- Dependencies: 236
-- Name: shelves_shelf_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shelves_shelf_id_seq OWNED BY public.shelves.shelf_id;


--
-- TOC entry 220 (class 1259 OID 24668)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    role public.user_role NOT NULL,
    password character varying(255) NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    birthdate date DEFAULT '2000-01-01'::date
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24667)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 5174 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 4928 (class 2604 OID 24771)
-- Name: bookings booking_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings ALTER COLUMN booking_id SET DEFAULT nextval('public.bookings_booking_id_seq'::regclass);


--
-- TOC entry 4920 (class 2604 OID 24699)
-- Name: buildings building_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buildings ALTER COLUMN building_id SET DEFAULT nextval('public.buildings_building_id_seq'::regclass);


--
-- TOC entry 4934 (class 2604 OID 24821)
-- Name: cupboards cupboard_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cupboards ALTER COLUMN cupboard_id SET DEFAULT nextval('public.cupboards_cupboard_id_seq'::regclass);


--
-- TOC entry 4927 (class 2604 OID 24743)
-- Name: facility_master facility_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facility_master ALTER COLUMN facility_id SET DEFAULT nextval('public.facility_master_facility_id_seq'::regclass);


--
-- TOC entry 4931 (class 2604 OID 24801)
-- Name: maintenance maintenance_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance ALTER COLUMN maintenance_id SET DEFAULT nextval('public.maintenance_maintenance_id_seq'::regclass);


--
-- TOC entry 4936 (class 2604 OID 32890)
-- Name: notifications notification_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN notification_id SET DEFAULT nextval('public.notifications_notification_id_seq'::regclass);


--
-- TOC entry 4919 (class 2604 OID 24688)
-- Name: resource_types resource_type_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_types ALTER COLUMN resource_type_id SET DEFAULT nextval('public.resource_types_resource_type_id_seq'::regclass);


--
-- TOC entry 4923 (class 2604 OID 24714)
-- Name: resources resource_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resources ALTER COLUMN resource_id SET DEFAULT nextval('public.resources_resource_id_seq'::regclass);


--
-- TOC entry 4935 (class 2604 OID 24837)
-- Name: shelves shelf_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shelves ALTER COLUMN shelf_id SET DEFAULT nextval('public.shelves_shelf_id_seq'::regclass);


--
-- TOC entry 4914 (class 2604 OID 24671)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 5151 (class 0 OID 24768)
-- Dependencies: 231
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookings (booking_id, resource_id, user_id, start_datetime, end_datetime, status, approver_id, created_at, approved_at, event_name) FROM stdin;
3	3	1	2025-01-15 14:00:00	2025-01-15 17:00:00	approved	3	2026-01-07 13:01:31.031753	\N	\N
2	2	2	2025-01-11 10:00:00	2025-01-11 12:00:00	rejected	1	2026-01-07 13:01:31.031753	\N	\N
1	1	2	2025-01-10 09:00:00	2025-01-10 11:00:00	rejected	34	2026-01-07 13:01:31.031753	2026-02-16 18:09:31.695	\N
35	3	39	2026-02-16 05:30:00	2026-02-17 05:30:00	approved	34	2026-02-16 16:29:23.565	2026-02-16 18:14:10.078	\N
34	3	39	2026-02-16 04:30:00	2026-02-17 04:30:00	rejected	34	2026-02-16 16:03:12.19	2026-02-16 18:28:38.984	\N
36	3	39	2026-02-18 08:52:00	2026-02-18 12:52:00	rejected	34	2026-02-16 18:33:50.393	2026-02-20 16:34:37.167	\N
\.


--
-- TOC entry 5144 (class 0 OID 24696)
-- Dependencies: 224
-- Data for Name: buildings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.buildings (building_id, building_name, building_number, total_floors, is_active, created_at) FROM stdin;
1	Engineering Block	ENG-01	5	t	2026-01-07 13:01:31.031753
2	Science Block	SCI-02	4	t	2026-01-07 13:01:31.031753
3	Admin Block	ADM-03	3	t	2026-01-07 13:01:31.031753
\.


--
-- TOC entry 5155 (class 0 OID 24818)
-- Dependencies: 235
-- Data for Name: cupboards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cupboards (cupboard_id, resource_id, cupboard_name, total_shelves) FROM stdin;
1	2	Lab Equipment Cupboard	5
2	4	Seminar Storage Cupboard	4
\.


--
-- TOC entry 5148 (class 0 OID 24740)
-- Dependencies: 228
-- Data for Name: facility_master; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.facility_master (facility_id, facility_name) FROM stdin;
1	Projector
2	Air Conditioner
3	Sound System
4	Smart Board
5	WiFi
\.


--
-- TOC entry 5153 (class 0 OID 24798)
-- Dependencies: 233
-- Data for Name: maintenance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.maintenance (maintenance_id, resource_id, maintenance_type, scheduled_date, status, notes, created_at, completed_at, completed_by, created_by) FROM stdin;
3	3	Sound Repair	2025-01-08	completed	Speaker fixed	2026-01-07 13:01:31.031753	\N	\N	\N
34	34	Ac repair	2026-01-26	completed	\N	2026-01-26 17:18:15.755	2026-02-20 16:02:09.425	34	\N
37	34	fhgjh	2026-02-17	completed	\N	2026-02-17 07:56:11.104	2026-02-20 16:03:13.97	34	34
2	2	System Check	2025-01-12	completed	Check all computers	2026-01-07 13:01:31.031753	2026-02-20 16:43:53.358	34	\N
36	2	Ac repairdemo	2026-02-17	cancelled	\N	2026-02-17 07:55:28.402	2026-02-20 16:43:59.401	34	34
35	3	Ac repair	2026-02-17	cancelled	\N	2026-02-17 07:54:58.105	2026-02-20 16:44:00.619	34	34
1	1	Cleaning	2025-01-05	completed	Routine cleaning done	2026-01-07 13:01:31.031753	2026-03-10 06:50:19.254	34	\N
39	4	fan repair	2026-03-10	scheduled	\N	2026-03-10 07:11:31.063	\N	\N	34
40	4	fan repair	2026-03-10	scheduled	\N	2026-03-10 07:11:31.371	\N	\N	34
41	4	fan repair	2026-03-10	scheduled	\N	2026-03-10 07:11:31.637	\N	\N	34
42	4	fan repair	2026-03-10	scheduled	\N	2026-03-10 07:11:31.994	\N	\N	34
43	4	fan repair	2026-03-10	scheduled	\N	2026-03-10 07:11:32.259	\N	\N	34
44	4	fan repair	2026-03-10	scheduled	\N	2026-03-10 07:11:32.521	\N	\N	34
38	4	fan repair	2026-03-10	cancelled	\N	2026-03-10 07:11:28.003	2026-03-10 07:11:44.776	34	34
45	3	Camrea repair	2026-03-10	scheduled	\N	2026-03-10 07:16:21.851	\N	\N	34
\.


--
-- TOC entry 5159 (class 0 OID 32887)
-- Dependencies: 239
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (notification_id, user_id, title, message, type, is_read, created_at) FROM stdin;
1	39	Booking Submitted	Your booking request for Auditorium Main has been submitted and is pending approval.	info	f	2026-02-16 18:33:50.424
2	3	New Booking Request	NormalUser requested Auditorium Main for 18/2/2026, 2:22:00 pm.	warning	f	2026-02-16 18:33:50.452
3	35	New Booking Request	NormalUser requested Auditorium Main for 18/2/2026, 2:22:00 pm.	warning	f	2026-02-16 18:33:50.455
4	39	Booking Approved	Your booking for Auditorium Main has been approved.	success	f	2026-02-16 18:36:48.623
\.


--
-- TOC entry 5149 (class 0 OID 24750)
-- Dependencies: 229
-- Data for Name: resource_facilities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resource_facilities (resource_id, facility_id) FROM stdin;
1	1
1	5
2	1
2	4
2	5
3	2
3	3
4	1
4	2
\.


--
-- TOC entry 5142 (class 0 OID 24685)
-- Dependencies: 222
-- Data for Name: resource_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resource_types (resource_type_id, type_name) FROM stdin;
1	Classroom
2	Computer Lab
3	Auditorium
4	Seminar Hall
\.


--
-- TOC entry 5146 (class 0 OID 24711)
-- Dependencies: 226
-- Data for Name: resources; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resources (resource_id, resource_name, resource_type_id, building_id, floor_number, capacity, description, is_active, created_at, updated_at) FROM stdin;
34	Classroom A-102	1	1	1	59		t	2026-01-26 16:37:34.869	2026-01-26 16:37:34.869
2	Computer Lab L-201	2	1	2	40	Programming lab	t	2026-01-07 13:01:31.031753	2026-01-07 13:01:31.031753
1	Classroom A-101	1	1	1	60	First year classroom	t	2026-01-07 13:01:31.031753	2026-01-07 13:01:31.031753
4	Seminar Hall S-301	4	2	3	120	Seminar hall with projector	t	2026-01-07 13:01:31.031753	2026-01-07 13:01:31.031753
3	Auditorium Main	3	3	1	300	College auditorium	f	2026-01-07 13:01:31.031753	2026-01-07 13:01:31.031753
\.


--
-- TOC entry 5157 (class 0 OID 24834)
-- Dependencies: 237
-- Data for Name: shelves; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shelves (shelf_id, cupboard_id, shelf_number, capacity, description) FROM stdin;
1	1	1	10	Keyboard storage
2	1	2	10	Mouse storage
3	1	3	5	CPU spare parts
4	2	1	8	Projector accessories
5	2	2	6	Cables and adapters
\.


--
-- TOC entry 5140 (class 0 OID 24668)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, name, email, role, password, is_active, created_at, updated_at, birthdate) FROM stdin;
4	Maintenance Guy	maint@rms.com	maintenance	$2b$10$yxDB8EjS/9CvQtQ4uHWmW.7lFRiLZxCZwPwDDz0ImgBcHkQtrbY1C	t	2026-01-07 13:01:31.031753	2026-01-07 13:01:31.031753	2000-01-01
36	Ayush Vasoya	ayush@2023.com	admin	$2b$10$10V5avJHAM/Bk1eYGFHv/O47WHKxGEpMLUmmWR1BgX55YcfGejLX.	t	2026-01-28 07:08:46.363	2026-01-28 07:08:46.363	2000-01-01
1	Admin User	admin@rms.com	admin	admin123	t	2026-01-07 13:01:31.031753	2026-01-07 13:01:31.031753	2000-01-01
34	Vivek Sudani	viveksudani182021@gmail.com	admin	$2b$10$/ibN5i/MXvUckoh9p7cvvu6cSEWs0KCdZBLDpCJOIP0mzYsbIAghS	t	2026-01-26 16:34:06.772	2026-01-26 16:34:06.772	2006-08-18
2	Student One	student1@rms.com	user	$2b$10$yH1rI7UW7wIc7fTijFkBBO2KwkQ22njHfQ9MPAbVAm5dBnVp5ywle	t	2026-01-07 13:01:31.031753	2026-01-07 13:01:31.031753	2000-01-01
39	NormalUser	NormalUser@gmail.com	user	$2b$10$M5/BulPfgTATylhtFPaJOO.88PTY/PdYe7DuRc8wD7gOj0CqHlYnm	t	2026-02-16 15:52:28.552	2026-02-16 15:52:28.552	2000-01-01
3	Staff Approver	approver@rms.com	approver	$2b$10$5ZHCxOUsCgke6nXajhm7M.l7LuJNK2CVaR28eqqo8oxgnZOiHjjHu	t	2026-01-07 13:01:31.031753	2026-01-07 13:01:31.031753	2000-01-01
35	Nikunj 	nikunj.rathod.3748@gmail.com	approver	$2b$10$/31xmP/f5cl4fyjZbCV77uSC99pqOEDskwAOexAh9GKVcnpmF0uMa	t	2026-01-27 06:52:15.224	2026-01-27 06:52:15.224	2000-01-01
\.


--
-- TOC entry 5175 (class 0 OID 0)
-- Dependencies: 230
-- Name: bookings_booking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bookings_booking_id_seq', 36, true);


--
-- TOC entry 5176 (class 0 OID 0)
-- Dependencies: 223
-- Name: buildings_building_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.buildings_building_id_seq', 33, true);


--
-- TOC entry 5177 (class 0 OID 0)
-- Dependencies: 234
-- Name: cupboards_cupboard_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cupboards_cupboard_id_seq', 33, true);


--
-- TOC entry 5178 (class 0 OID 0)
-- Dependencies: 227
-- Name: facility_master_facility_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.facility_master_facility_id_seq', 33, true);


--
-- TOC entry 5179 (class 0 OID 0)
-- Dependencies: 232
-- Name: maintenance_maintenance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.maintenance_maintenance_id_seq', 45, true);


--
-- TOC entry 5180 (class 0 OID 0)
-- Dependencies: 238
-- Name: notifications_notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_notification_id_seq', 4, true);


--
-- TOC entry 5181 (class 0 OID 0)
-- Dependencies: 221
-- Name: resource_types_resource_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.resource_types_resource_type_id_seq', 33, true);


--
-- TOC entry 5182 (class 0 OID 0)
-- Dependencies: 225
-- Name: resources_resource_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.resources_resource_id_seq', 34, true);


--
-- TOC entry 5183 (class 0 OID 0)
-- Dependencies: 236
-- Name: shelves_shelf_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shelves_shelf_id_seq', 33, true);


--
-- TOC entry 5184 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 42, true);


--
-- TOC entry 4964 (class 2606 OID 24781)
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (booking_id);


--
-- TOC entry 4950 (class 2606 OID 24709)
-- Name: buildings buildings_building_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buildings
    ADD CONSTRAINT buildings_building_number_key UNIQUE (building_number);


--
-- TOC entry 4952 (class 2606 OID 24707)
-- Name: buildings buildings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buildings
    ADD CONSTRAINT buildings_pkey PRIMARY KEY (building_id);


--
-- TOC entry 4972 (class 2606 OID 24827)
-- Name: cupboards cupboards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cupboards
    ADD CONSTRAINT cupboards_pkey PRIMARY KEY (cupboard_id);


--
-- TOC entry 4958 (class 2606 OID 24749)
-- Name: facility_master facility_master_facility_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facility_master
    ADD CONSTRAINT facility_master_facility_name_key UNIQUE (facility_name);


--
-- TOC entry 4960 (class 2606 OID 24747)
-- Name: facility_master facility_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facility_master
    ADD CONSTRAINT facility_master_pkey PRIMARY KEY (facility_id);


--
-- TOC entry 4970 (class 2606 OID 24811)
-- Name: maintenance maintenance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance
    ADD CONSTRAINT maintenance_pkey PRIMARY KEY (maintenance_id);


--
-- TOC entry 4978 (class 2606 OID 32904)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (notification_id);


--
-- TOC entry 4962 (class 2606 OID 24756)
-- Name: resource_facilities resource_facilities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_facilities
    ADD CONSTRAINT resource_facilities_pkey PRIMARY KEY (resource_id, facility_id);


--
-- TOC entry 4946 (class 2606 OID 24692)
-- Name: resource_types resource_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_types
    ADD CONSTRAINT resource_types_pkey PRIMARY KEY (resource_type_id);


--
-- TOC entry 4948 (class 2606 OID 24694)
-- Name: resource_types resource_types_type_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_types
    ADD CONSTRAINT resource_types_type_name_key UNIQUE (type_name);


--
-- TOC entry 4954 (class 2606 OID 24726)
-- Name: resources resources_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_pkey PRIMARY KEY (resource_id);


--
-- TOC entry 4974 (class 2606 OID 24846)
-- Name: shelves shelves_cupboard_id_shelf_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shelves
    ADD CONSTRAINT shelves_cupboard_id_shelf_number_key UNIQUE (cupboard_id, shelf_number);


--
-- TOC entry 4976 (class 2606 OID 24844)
-- Name: shelves shelves_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shelves
    ADD CONSTRAINT shelves_pkey PRIMARY KEY (shelf_id);


--
-- TOC entry 4956 (class 2606 OID 24728)
-- Name: resources unique_resource_per_building; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT unique_resource_per_building UNIQUE (resource_name, building_id);


--
-- TOC entry 4942 (class 2606 OID 24683)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4944 (class 2606 OID 24681)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4965 (class 1259 OID 24854)
-- Name: idx_bookings_end; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_end ON public.bookings USING btree (end_datetime);


--
-- TOC entry 4966 (class 1259 OID 24852)
-- Name: idx_bookings_resource; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_resource ON public.bookings USING btree (resource_id);


--
-- TOC entry 4967 (class 1259 OID 24853)
-- Name: idx_bookings_start; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_start ON public.bookings USING btree (start_datetime);


--
-- TOC entry 4968 (class 1259 OID 24855)
-- Name: idx_maintenance_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_maintenance_date ON public.maintenance USING btree (scheduled_date);


--
-- TOC entry 4983 (class 2606 OID 24792)
-- Name: bookings bookings_approver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_approver_id_fkey FOREIGN KEY (approver_id) REFERENCES public.users(user_id);


--
-- TOC entry 4984 (class 2606 OID 24782)
-- Name: bookings bookings_resource_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_resource_id_fkey FOREIGN KEY (resource_id) REFERENCES public.resources(resource_id);


--
-- TOC entry 4985 (class 2606 OID 24787)
-- Name: bookings bookings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 4989 (class 2606 OID 24828)
-- Name: cupboards cupboards_resource_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cupboards
    ADD CONSTRAINT cupboards_resource_id_fkey FOREIGN KEY (resource_id) REFERENCES public.resources(resource_id);


--
-- TOC entry 4979 (class 2606 OID 24734)
-- Name: resources fk_building; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT fk_building FOREIGN KEY (building_id) REFERENCES public.buildings(building_id);


--
-- TOC entry 4980 (class 2606 OID 24729)
-- Name: resources fk_resource_type; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT fk_resource_type FOREIGN KEY (resource_type_id) REFERENCES public.resource_types(resource_type_id);


--
-- TOC entry 4986 (class 2606 OID 32881)
-- Name: maintenance maintenance_completed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance
    ADD CONSTRAINT maintenance_completed_by_fkey FOREIGN KEY (completed_by) REFERENCES public.users(user_id);


--
-- TOC entry 4987 (class 2606 OID 32876)
-- Name: maintenance maintenance_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance
    ADD CONSTRAINT maintenance_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(user_id);


--
-- TOC entry 4988 (class 2606 OID 24812)
-- Name: maintenance maintenance_resource_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance
    ADD CONSTRAINT maintenance_resource_id_fkey FOREIGN KEY (resource_id) REFERENCES public.resources(resource_id);


--
-- TOC entry 4991 (class 2606 OID 32905)
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4981 (class 2606 OID 24762)
-- Name: resource_facilities resource_facilities_facility_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_facilities
    ADD CONSTRAINT resource_facilities_facility_id_fkey FOREIGN KEY (facility_id) REFERENCES public.facility_master(facility_id);


--
-- TOC entry 4982 (class 2606 OID 24757)
-- Name: resource_facilities resource_facilities_resource_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resource_facilities
    ADD CONSTRAINT resource_facilities_resource_id_fkey FOREIGN KEY (resource_id) REFERENCES public.resources(resource_id);


--
-- TOC entry 4990 (class 2606 OID 24847)
-- Name: shelves shelves_cupboard_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shelves
    ADD CONSTRAINT shelves_cupboard_id_fkey FOREIGN KEY (cupboard_id) REFERENCES public.cupboards(cupboard_id);


-- Completed on 2026-03-11 12:27:36

--
-- PostgreSQL database dump complete
--

\unrestrict ZoycJCK1RvjW79VZUmXUvWYffk6tbNKTKzDrtXGgZNHmMMNd6H44PtIArImrNo6

