import './admin.css';

export default function Admin() {


    return (
        <div className='container'>
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-content">
                    <div className="sidebar-header">
                        <div className="logo"></div>
                        <div className="sidebar-info">
                            <h1>Admin</h1>
                            <p>Club Escape</p>
                        </div>
                    </div>

                    <nav className="menu">
                        <a href="#" className="menu-item active">
                            <span className="icon material-symbols-outlined">home</span>
                            <p>Panel de control</p>
                        </a>
                        <a href="#" className="menu-item">
                            <span className="icon material-symbols-outlined">calendar_month</span>
                            <p>Reservas</p>
                        </a>
                        <a href="#" className="menu-item">
                            <span className="icon material-symbols-outlined">bar_chart</span>
                            <p>Analíticas</p>
                        </a>
                    </nav>
                </div>

                <button className="btn-primary">Nueva sala</button>
            </aside>

            {/* Main content */}
            <main className="main">
                <section className="dashboard-header">
                    <h1>Panel de control</h1>
                    <p>Here's what's happening with your escape rooms today.</p>
                </section>

                <section className="cards">
                    <div className="card">
                        <p className="label">Reservas de hoy</p>
                        <p className="value">14</p>
                        <p className="change">+5% from yesterday</p>
                    </div>

                    <div className="card">
                        <p className="label">Upcoming Reservations</p>
                        <p className="value">28</p>
                        <p className="change">+2% this week</p>
                    </div>

                    <div className="card">
                        <p className="label">Total Revenue Today</p>
                        <p className="value">$2,100</p>
                        <p className="change">+12% from yesterday</p>
                    </div>
                </section>

                <section className="rooms">
                    <div className="rooms-header">
                        <h2>Available Escape Rooms</h2>
                        <div className="actions">
                            <button className="btn-secondary">
                                <span className="icon material-symbols-outlined">tune</span>
                                Filter
                            </button>
                            <button className="btn-secondary">
                                <span className="icon material-symbols-outlined">sort</span>
                                Sort by
                            </button>
                        </div>
                    </div>

                    <div className="rooms-grid">
                        {/*  Room 1 */}
                        <div className="room-card">
                            <div className="room-image"></div>
                            <div className="room-content">
                                <h3>The Pharaoh's Curse</h3>
                                <p>Uncover the secrets of the ancient tomb before you're trapped forever.</p>
                                <div className="room-info">
                                    <span><span className="icon material-symbols-outlined">group</span> 4-8 Players</span>
                                    <span><span className="icon material-symbols-outlined">signal_cellular_alt</span> Hard</span>
                                </div>
                                <button className="btn-primary small">View Schedule</button>
                            </div>
                        </div>

                        {/* Room 2 */}
                        <div className="room-card">
                            <div className="room-image"></div>
                            <div className="room-content">
                                <h3>Cybernetic Sabotage</h3>
                                <p>Infiltrate the AI core and stop the rogue system from launching a global attack.</p>
                                <div className="room-info">
                                    <span><span className="icon material-symbols-outlined">group</span> 2-6 Players</span>
                                    <span><span className="icon material-symbols-outlined">signal_cellular_alt</span> Medium</span>
                                </div>
                                <button className="btn-primary small">View Schedule</button>
                            </div>
                        </div>

                        {/* Room 3 */}
                        <div className="room-card">
                            <div className="room-image"></div>
                            <div className="room-content">
                                <h3>Marooned Mariner</h3>
                                <p>Find Captain Blackheart's hidden treasure before his ghost returns at high tide.</p>
                                <div className="room-info">
                                    <span><span className="icon material-symbols-outlined">group</span> 3-7 Players</span>
                                    <span><span className="icon material-symbols-outlined">signal_cellular_alt</span> Easy</span>
                                </div>
                                <button className="btn-primary small">View Schedule</button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>

    )
}