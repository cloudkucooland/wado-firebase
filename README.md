# wado-firebase

The Order of St. Luke's Web-Amplified Daily Office as a Firebase Web App

Monks writing code. Be very afraid.

# Why would anyone even look at this project?

I expect that some people might find some of the integrations interesting. The functionaity of the app itself is pretty specific to our needs, but the tech stack has some neat parts that others might find useful. I've not found another project that connects svelte, sveltestrap, vite, custom bootstrap-scss, firebase, Go, Meilisearch and all the other bits together into a cohesive whole. Personally, I think the media upload bit is really quite nice.

# History

The Order of Saint Luke is a eccumenical (multi-denominational) Christian religious order dedicated to liturgical scholarship and practice.

The prayers we pray each day are our "daily office" which consists of 5 major "offices" (sets of prayers at appointed times).

WADO is a web tool for praying the offices adjusted for the season, or sometimes for the specific day.

The OSL Daily Office Revision Team (DORT) have spent years building an amplified office. WADO is the tool for making the amplified office available to our members and the general public.

# Technology Overview

WADO 1.0 was written in PHP using SQLite around 2010. The data from DORT was slowly loaded in.
As DORT did its work, the limitations of WADO 1.0 became apparent.

WADO 2.0 is an attempt to overcome the limitations of WADO 1.0 and provide a clear path for future growth.

## The main user interface is written in Svelte and Typescript.

Moving the display logic out to the client just makes sense. Svelte made this easy.

## Backend functions are provided by Firebase.

Firestore for the database.
Google Cloud Storage for the media files.

Some of the logic is still fairly SQL-ish, because the author has been using SQL for decades and that's how his brain works. The design is fairly clean and modern No-SQL.

## Some of the logic is written in Go, served as Google Cloud Functions

Some things just make more sense not managed in the clients.

## Meilisearch is used for full-text searching

It just works.

## Admin tools and ad-hoc stuff is done in Go, because Go is awesome

## The Liturgical calendar is insane. Seriously

Parts of the Christian calendar are fixed to the Julian calendar. Parts are relative to Easter, which is calculated based on a full moon and the spring solstice. It isn't an easy way of working. If you are working with the liturgical calendar, this might be helpful for you.
