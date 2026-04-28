import React, { useMemo } from 'react';
import Layout from '@theme/Layout';
import ticketsData from '../../generated/tickets.json';
import clsx from 'clsx';

// Types
interface Ticket {
  id: string;
  title: string;
  status: string;
  priority: string;
  project: string;
  owner: string;
  updated: string;
  lease_until: string;
  estimate: string;
  depends_on: string;
  blocked_by: string;
  tags: string[];
  folder: string;
}

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'critical': return 'var(--ifm-color-danger)';
    case 'high': return 'var(--ifm-color-warning)';
    case 'medium': return 'var(--ifm-color-info)';
    case 'low': return 'var(--ifm-color-secondary)';
    default: return 'var(--ifm-color-secondary)';
  }
};

const getPriorityWeight = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'critical': return 4;
    case 'high': return 3;
    case 'medium': return 2;
    case 'low': return 1;
    default: return 0;
  }
};

const getDaysOld = (dateString: string) => {
  const diffTime = Math.abs(new Date().getTime() - new Date(dateString).getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const isLeaseExpired = (leaseUntil: string) => {
  if (!leaseUntil) return false;
  return new Date().getTime() > new Date(leaseUntil).getTime();
};

const TicketCard = ({ ticket }: { ticket: Ticket }) => {
  const isExpired = isLeaseExpired(ticket.lease_until);
  const isBlocked = ticket.folder === 'blocked';

  return (
    <div
      className={clsx('card margin-bottom--md', {
        'blocked-card': isBlocked,
        'expired-lease': isExpired
      })}
      style={{
        borderLeft: `4px solid ${getPriorityColor(ticket.priority)}`,
        ...(isBlocked ? { border: '2px solid red' } : {})
      }}
    >
      <div className="card__header">
        <h4 style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
          <span>{ticket.id}</span>
          <span style={{ fontSize: '0.8em', color: getPriorityColor(ticket.priority), fontWeight: 'bold' }}>
            {ticket.priority.toUpperCase()}
          </span>
        </h4>
        <div style={{ fontSize: '0.9em', fontWeight: 'bold' }}>{ticket.title}</div>
      </div>
      <div className="card__body" style={{ fontSize: '0.85em', paddingTop: '0.5rem' }}>
        <div>Owner: {ticket.owner}</div>
        <div>Age: {getDaysOld(ticket.updated)}d</div>
        {isExpired && <div style={{ color: 'red', fontWeight: 'bold', animation: 'blink 1s linear infinite' }}>EXPIRED LEASE</div>}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const tickets = ticketsData as Ticket[];

  const metrics = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      ready: tickets.filter(t => t.folder === 'ready').length,
      inProgress: tickets.filter(t => t.folder === 'in_progress').length,
      review: tickets.filter(t => t.folder === 'review').length,
      blocked: tickets.filter(t => t.folder === 'blocked').length,
      doneToday: tickets.filter(t => t.folder === 'done' && new Date(t.updated) >= today).length,
      expiredClaims: tickets.filter(t => isLeaseExpired(t.lease_until)).length,
    };
  }, [tickets]);

  const agentLoads = useMemo(() => {
    const loads: Record<string, number> = {};
    tickets.forEach(t => {
      if (['in_progress', 'review'].includes(t.folder) && t.owner && t.owner !== 'unassigned') {
        loads[t.owner] = (loads[t.owner] || 0) + 1;
      }
    });
    return loads;
  }, [tickets]);

  const projectsHealth = useMemo(() => {
    const health: Record<string, { open: number, blocked: number, doneThisWeek: number }> = {};
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    tickets.forEach(t => {
      if (!t.project) return;
      if (!health[t.project]) health[t.project] = { open: 0, blocked: 0, doneThisWeek: 0 };

      if (['ready', 'in_progress', 'review'].includes(t.folder)) {
        health[t.project].open++;
      } else if (t.folder === 'blocked') {
        health[t.project].blocked++;
      } else if (t.folder === 'done' && new Date(t.updated) >= oneWeekAgo) {
        health[t.project].doneThisWeek++;
      }
    });
    return health;
  }, [tickets]);

  const priorityQueue = useMemo(() => {
    return tickets
      .filter(t => t.folder === 'ready')
      .sort((a, b) => {
        // priority
        if (getPriorityWeight(b.priority) !== getPriorityWeight(a.priority)) {
          return getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
        }
        // oldest
        return new Date(a.updated).getTime() - new Date(b.updated).getTime();
      })
      .slice(0, 10);
  }, [tickets]);

  return (
    <Layout title="Master Dashboard" description="Flow Control Center">
      <main className="container margin-vert--lg">
        <h1>Flow Control Center</h1>

        {/* Top Summary Row */}
        <div className="row margin-bottom--lg">
          <div className="col"><div className="card padding--md text--center"><h3>{metrics.ready}</h3><p>Ready</p></div></div>
          <div className="col"><div className="card padding--md text--center"><h3>{metrics.inProgress}</h3><p>In Progress</p></div></div>
          <div className="col"><div className="card padding--md text--center"><h3>{metrics.review}</h3><p>Review</p></div></div>
          <div className="col"><div className="card padding--md text--center"><h3>{metrics.blocked}</h3><p>Blocked</p></div></div>
          <div className="col"><div className="card padding--md text--center"><h3>{metrics.doneToday}</h3><p>Done Today</p></div></div>
          <div className="col"><div className="card padding--md text--center" style={metrics.expiredClaims > 0 ? {backgroundColor: '#ffebee'} : {}}><h3>{metrics.expiredClaims}</h3><p>Expired Claims</p></div></div>
        </div>

        {/* Board View */}
        <div className="row margin-bottom--xl">
          {['ready', 'in_progress', 'review', 'blocked', 'done'].map(status => (
            <div key={status} className="col">
              <h3 style={{ textTransform: 'capitalize', borderBottom: '2px solid var(--ifm-color-emphasis-300)', paddingBottom: '0.5rem' }}>
                {status.replace('_', ' ')}
              </h3>
              <div>
                {tickets.filter(t => t.folder === status).map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="row">
          {/* Agent Load Panel */}
          <div className="col col--4 margin-bottom--lg">
            <div className="card padding--md">
              <h3>Agent Load Panel</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {Object.entries(agentLoads).map(([agent, load]) => (
                  <li key={agent} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: load > 2 ? 'red' : 'inherit', fontWeight: load > 2 ? 'bold' : 'normal' }}>
                    <span>{agent}</span>
                    <span>{load} {load > 2 ? '🔥' : ''}</span>
                  </li>
                ))}
                {Object.keys(agentLoads).length === 0 && <li>No active assignments</li>}
              </ul>
            </div>
          </div>

          {/* Priority Queue View */}
          <div className="col col--4 margin-bottom--lg">
            <div className="card padding--md">
              <h3>Priority Queue (Top 10)</h3>
              <ul style={{ paddingLeft: '1.2rem' }}>
                {priorityQueue.map(t => (
                  <li key={t.id} style={{ marginBottom: '0.5rem' }}>
                    <strong>{t.id}</strong> ({t.priority})<br/>
                    <small>{t.title}</small>
                  </li>
                ))}
                {priorityQueue.length === 0 && <li>Queue empty</li>}
              </ul>
            </div>
          </div>

          {/* Project Health */}
          <div className="col col--4 margin-bottom--lg">
            <div className="card padding--md">
              <h3>Project Health</h3>
              {Object.entries(projectsHealth).map(([project, health]) => (
                <div key={project} className="margin-bottom--sm">
                  <strong>{project}</strong>
                  <div style={{ fontSize: '0.85em', display: 'flex', gap: '1rem', marginTop: '0.2rem' }}>
                    <span>Open: {health.open}</span>
                    <span style={{ color: health.blocked > 0 ? 'red' : 'inherit' }}>Blocked: {health.blocked}</span>
                    <span style={{ color: 'green' }}>Done (7d): {health.doneThisWeek}</span>
                  </div>
                </div>
              ))}
              {Object.keys(projectsHealth).length === 0 && <p>No projects found</p>}
            </div>
          </div>
        </div>
      </main>
      <style>{`
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </Layout>
  );
}
