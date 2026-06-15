import { NavLink } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div className="home__page dashboard-overview">
      <h1 className="home__page-title">Dashboard</h1>
      <p className="home__page-description">
        Welcome to PrepRoute — your path to exam success.
      </p>

      <p className="dashboard-overview__intro">
        Create, publish, and manage practice tests for your students — all in one place.
      </p>

      <div className="dashboard-overview__grid">
        <section className="dashboard-overview__card">
          <h2 className="dashboard-overview__card-title">Test Creation</h2>
          <p className="dashboard-overview__card-text">
            Build a test in three steps: configure details, add questions, then publish.
          </p>
          <ul className="dashboard-overview__list">
            <li>Set test type, subject, topic, and subtopic</li>
            <li>Define duration, difficulty, and scoring rules</li>
            <li>Choose number of questions and total marks</li>
          </ul>
        </section>

        <section className="dashboard-overview__card">
          <h2 className="dashboard-overview__card-title">Add Questions</h2>
          <p className="dashboard-overview__card-text">
            Add multiple-choice questions with a rich text editor.
          </p>
          <ul className="dashboard-overview__list">
            <li>Four answer options (A–D) per question</li>
            <li>Mark the correct answer and set difficulty</li>
            <li>Fill question slots until your test is complete</li>
          </ul>
        </section>

        <section className="dashboard-overview__card">
          <h2 className="dashboard-overview__card-title">Publish</h2>
          <p className="dashboard-overview__card-text">
            Make your test available to students when you are ready.
          </p>
          <ul className="dashboard-overview__list">
            <li>Publish now or schedule for later</li>
            <li>Set how long the test stays live</li>
            <li>Review settings before confirming</li>
          </ul>
        </section>

        <section className="dashboard-overview__card">
          <h2 className="dashboard-overview__card-title">Test Tracking</h2>
          <p className="dashboard-overview__card-text">
            View and manage all tests you have created.
          </p>
          <ul className="dashboard-overview__list">
            <li>See creation date and publish mode</li>
            <li>Check how many questions were added</li>
            <li>Edit or delete tests anytime</li>
          </ul>
        </section>
      </div>

      <nav className="dashboard-overview__actions" aria-label="Quick actions">
        <NavLink to="/home/test-creation" className="dashboard-overview__action">
          Start creating a test
        </NavLink>
        <NavLink to="/home/test-tracking" className="dashboard-overview__action">
          View your tests
        </NavLink>
      </nav>
    </div>
  )
}
