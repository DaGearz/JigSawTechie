'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, MessageSquare, Eye, DollarSign, Calendar } from 'lucide-react';

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  description: string;
}

interface BusinessMetricsProps {
  isAdmin?: boolean;
}

export default function BusinessMetrics({ isAdmin = false }: BusinessMetricsProps) {
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching metrics data
    const fetchMetrics = async () => {
      // In a real app, this would fetch from your analytics API
      const mockMetrics: MetricCard[] = [
        {
          title: 'Total Quotes',
          value: 47,
          change: 12,
          changeType: 'increase',
          icon: <MessageSquare className="h-6 w-6" />,
          description: 'Quote requests this month'
        },
        {
          title: 'Active Projects',
          value: 8,
          change: 3,
          changeType: 'increase',
          icon: <Calendar className="h-6 w-6" />,
          description: 'Currently in progress'
        },
        {
          title: 'Demo Views',
          value: 234,
          change: 18,
          changeType: 'increase',
          icon: <Eye className="h-6 w-6" />,
          description: 'Template demos viewed'
        },
        {
          title: 'Client Satisfaction',
          value: '98%',
          change: 2,
          changeType: 'increase',
          icon: <TrendingUp className="h-6 w-6" />,
          description: 'Based on client feedback'
        },
        {
          title: 'Revenue This Month',
          value: '$12,450',
          change: 25,
          changeType: 'increase',
          icon: <DollarSign className="h-6 w-6" />,
          description: 'Completed projects'
        },
        {
          title: 'New Clients',
          value: 6,
          change: 1,
          changeType: 'increase',
          icon: <Users className="h-6 w-6" />,
          description: 'Joined this month'
        }
      ];

      // Filter metrics based on user role
      const filteredMetrics = isAdmin 
        ? mockMetrics 
        : mockMetrics.filter(m => !['Revenue This Month', 'Total Quotes'].includes(m.title));

      setMetrics(filteredMetrics);
      setLoading(false);
    };

    fetchMetrics();
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      {/* Quick Actions (Admin Only) */}
      {isAdmin && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="bg-blue-50 text-blue-700 p-4 rounded-lg hover:bg-blue-100 transition-colors text-left">
              <div className="font-medium">Review Quotes</div>
              <div className="text-sm text-blue-600">3 pending</div>
            </button>
            <button className="bg-green-50 text-green-700 p-4 rounded-lg hover:bg-green-100 transition-colors text-left">
              <div className="font-medium">Update Projects</div>
              <div className="text-sm text-green-600">2 need updates</div>
            </button>
            <button className="bg-purple-50 text-purple-700 p-4 rounded-lg hover:bg-purple-100 transition-colors text-left">
              <div className="font-medium">Client Messages</div>
              <div className="text-sm text-purple-600">5 unread</div>
            </button>
            <button className="bg-orange-50 text-orange-700 p-4 rounded-lg hover:bg-orange-100 transition-colors text-left">
              <div className="font-medium">Deploy Demos</div>
              <div className="text-sm text-orange-600">1 ready</div>
            </button>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'New quote request', client: 'Sarah Johnson', time: '2 hours ago', type: 'quote' },
            { action: 'Demo viewed', client: 'Restaurant Template', time: '4 hours ago', type: 'demo' },
            { action: 'Project completed', client: 'Chen & Associates', time: '1 day ago', type: 'project' },
            { action: 'Client message', client: 'Emily Rodriguez', time: '2 days ago', type: 'message' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'quote' ? 'bg-blue-500' :
                  activity.type === 'demo' ? 'bg-green-500' :
                  activity.type === 'project' ? 'bg-purple-500' :
                  'bg-orange-500'
                }`}></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                  <div className="text-xs text-gray-500">{activity.client}</div>
                </div>
              </div>
              <div className="text-xs text-gray-400">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ metric }: { metric: MetricCard }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-500">{metric.icon}</div>
        <div className={`flex items-center text-sm font-medium ${
          metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
        }`}>
          <TrendingUp className={`h-4 w-4 mr-1 ${
            metric.changeType === 'decrease' ? 'rotate-180' : ''
          }`} />
          {metric.change}%
        </div>
      </div>
      
      <div className="mb-2">
        <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
        <div className="text-sm font-medium text-gray-700">{metric.title}</div>
      </div>
      
      <div className="text-xs text-gray-500">{metric.description}</div>
    </div>
  );
}
