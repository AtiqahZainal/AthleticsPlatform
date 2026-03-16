// Import Supabase client
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Replace these with your actual Supabase Project URL and anon key
const supabaseUrl = 'https://xvwlhsdpimpwozokdvgt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2d2xoc2RwaW1wd296b2tkdmd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NjY2OTAsImV4cCI6MjA4OTE0MjY5MH0.GZbIyDC3BI9_gc9VWrvVV2aIdeLNyUA0a3UoKDuv2H0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function loadLeaderboard() {
  const { data, error } = await supabase
    .from('event_stage_leaderboard')  // your view name
    .select('*')
    .order('event_no', { ascending: true });

  console.log(data, error); // debug: check in browser console

  const table = document.getElementById('leaderboard');

  // Clear existing rows (except header)
  table.querySelectorAll('tr:not(:first-child)').forEach(tr => tr.remove());

  // Populate table
  data.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.competition}</td>
      <td>${row.event_name}</td>
      <td>${row.stage}</td>
      <td>${row.athlete}</td>
      <td>${row.club}</td>
      <td>${row.time}</td>
      <td>${row.position}</td>
    `;
    table.appendChild(tr);
  });
}

// Load leaderboard on page load
loadLeaderboard();

const form = document.getElementById("resultForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const athlete_id = document.getElementById("athlete_select").value;
  const event_id = document.getElementById("event_select").value;
  const time = document.getElementById("time").value;
  const position = document.getElementById("position").value;

  const { data, error } = await supabase
    .from("results")
    .insert([
      {
        athlete_id: athlete_id,
        event_id: event_id,
        time: time,
        position: position
      }
    ]);

  console.log(data, error);

  if (!error) {
    alert("Result added!");
    loadLeaderboard();
  }
});

setInterval(loadLeaderboard, 5000);

async function loadAthletes() {

  const { data, error } = await supabase
    .from('athletes')
    .select('id, name')
    .order('name');

  const select = document.getElementById("athlete_select");

  data.forEach(athlete => {

    const option = document.createElement("option");
    option.value = athlete.id;
    option.text = athlete.name;

    select.appendChild(option);

  });

}

async function loadEvents() {

  const { data, error } = await supabase
    .from('events')
    .select('id, event_name, stage')
    .order('event_no');

  const select = document.getElementById("event_select");

  data.forEach(event => {

    const option = document.createElement("option");
    option.value = event.id;
    option.text = event.event_name + " - " + event.stage;

    select.appendChild(option);

  });

}

loadLeaderboard();
loadAthletes();
loadEvents();