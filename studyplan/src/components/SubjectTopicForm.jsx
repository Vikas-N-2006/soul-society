import { useState } from "react";
import axios from "axios";

export function SubjectTopicForm() {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [tasks, setTasks] = useState([]);
  const [youtubeResults, setYoutubeResults] = useState([]); // YouTube results state

  const streamSubjects = {
    commerce: ["Accountancy", "Business Studies", "Economics", "Mathematics"],
    science: ["Physics", "Chemistry", "Biology", "Mathematics", "Computer Science"],
    engineering: ["Mechanics", "Thermodynamics", "Computer Science", "Electronics", "Civil Engineering"],
    mbbs: ["Anatomy", "Physiology", "Biochemistry", "Pathology", "Pharmacology"],
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTasks((prevTasks) => [...prevTasks, { subject, topic, classLevel }]);
    setSubject("");
    setTopic("");
    setClassLevel("");
  };

  const searchYouTube = async (searchQuery) => {
    const API_KEY = "AIzaSyDQzgCKv49XLKqjohAXxk6xavXyvaPzEp8"; // Replace with your YouTube Data API key
    const baseURL = "https://www.googleapis.com/youtube/v3/search";
    const query = `part=snippet&q=${searchQuery}&type=video&key=${API_KEY}`; // Ensures only videos are fetched

    try {
      // Primary search for the given topic
      const { data } = await axios.get(`${baseURL}?${query}`);
      const validVideos = data.items.filter((video) => video.id.videoId); // Filter for valid videos with IDs

      if (validVideos.length > 0) {
        setYoutubeResults(validVideos); // Update results with valid videos
      } else {
        // Fallback search for related educational videos
        console.log("No videos found for the query. Fetching related videos...");
        const { data: fallbackData } = await axios.get(
          `${baseURL}?part=snippet&q=educational&type=video&key=${API_KEY}`
        );
        setYoutubeResults(fallbackData.items.filter((video) => video.id.videoId)); // Update with fallback results
      }
    } catch (error) {
      console.error("Error fetching YouTube data:", error);
    }
  };

  const formStyle = { maxWidth: "400px", margin: "0 auto", padding: "20px", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" };
  const inputStyle = { width: "100%", padding: "8px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "4px" };
  const buttonStyle = { width: "100%", padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" };
  const taskButtonStyle = { padding: "5px 10px", marginLeft: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" };
  const linkStyle = { color: "#ff0000", fontWeight: "bold", textDecoration: "underline" };

  return (
    <div>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div>
          <label htmlFor="classLevel">Class Level</label>
          <select
            id="classLevel"
            value={classLevel}
            onChange={(e) => setClassLevel(e.target.value)}
            required
            style={inputStyle}
          >
            <option value="">Select Class Level</option>
            <option value="commerce">11 - Commerce</option>
            <option value="science">11 - Science</option>
            <option value="commerce-12">12 - Commerce</option>
            <option value="science-12">12 - Science</option>
            <option value="engineering">Engineering</option>
            <option value="mbbs">MBBS</option>
          </select>
        </div>
        <div>
          <label htmlFor="subject">Subject</label>
          <select
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            style={inputStyle}
          >
            <option value="">Select Subject</option>
            {["commerce", "commerce-12"].includes(classLevel) &&
              streamSubjects.commerce.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            {["science", "science-12"].includes(classLevel) &&
              streamSubjects.science.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            {classLevel === "engineering" &&
              streamSubjects.engineering.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            {classLevel === "mbbs" &&
              streamSubjects.mbbs.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
          </select>
        </div>
        <div>
          <label htmlFor="topic">Topic</label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
            style={inputStyle}
            placeholder="Enter topic"
          />
        </div>
        <button type="submit" style={buttonStyle}>Add Subject/Topic</button>
      </form>

      <div style={{ marginTop: "20px" }}>
        <h3>Your Tasks:</h3>
        <ul>
          {tasks.map((task, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              <strong>{task.subject}</strong> - {task.topic} (Class Level: {task.classLevel})
              <button onClick={() => searchYouTube(task.topic)} style={taskButtonStyle}>YouTube Search</button>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>YouTube Results:</h3>
        <ul>
          {youtubeResults.length > 0 ? (
            youtubeResults.map((video) => (
              <li key={video.id.videoId}>
                <a
                  href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkStyle}
                >
                  {video.snippet.title}
                </a>
              </li>
            ))
          ) : (
            <p>No videos found. Showing related educational videos.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
