'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Users, TrendingUp, Activity, RefreshCw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface User {
  user_id: string;
  email: string;
  full_name: string;
  role: string;
  plan_id: string;
  plan_name: string;
  subscription_status: string;
  created_at: string;
}

interface Usage {
  usage_key: string;
  current_count: number;
  limit_value: number;
  percentage: number;
}

export default function AdminDashboardPage() {
  const [isDirector, setIsDirector] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userUsage, setUserUsage] = useState<Usage[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    checkDirectorAccess();
  }, []);

  const checkDirectorAccess = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }
      
      // Check if user is director
      const { data: isDir } = await supabase.rpc('is_director', {
        p_user_id: user.id
      });
      
      setIsDirector(isDir === true);
      
      if (isDir === true) {
        await fetchUsers();
      }
    } catch (error) {
      console.error('Error checking director access:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchUserUsage = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/user-usage?user_id=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setUserUsage(data.usage || []);
      }
    } catch (error) {
      console.error('Error fetching user usage:', error);
    }
  };

  const changePlan = async (userId: string, newPlanId: string) => {
    if (!confirm(`Change user's plan to ${newPlanId}?`)) return;
    
    setActionLoading(true);
    try {
      const response = await fetch('/api/admin/change-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          plan_id: newPlanId,
          reason: 'Director manual change'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Plan changed successfully!');
        await fetchUsers();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error changing plan:', error);
      alert('Failed to change plan');
    } finally {
      setActionLoading(false);
    }
  };

  const resetUsage = async (userId: string, usageKey: string) => {
    if (!confirm(`Reset ${usageKey} for this user?`)) return;
    
    setActionLoading(true);
    try {
      const response = await fetch('/api/admin/reset-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          usage_key: usageKey,
          reason: 'Director manual reset'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Usage reset successfully!');
        if (selectedUser) {
          await fetchUserUsage(selectedUser.user_id);
        }
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error resetting usage:', error);
      alert('Failed to reset usage');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isDirector) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            This page is only accessible to directors
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            Director Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Admin panel with meta-powers
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <Users className="w-8 h-8 text-blue-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
        </div>
        
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {users.filter(u => u.plan_id !== 'free').length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Paying Users</p>
        </div>
        
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <Activity className="w-8 h-8 text-purple-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {users.filter(u => u.plan_id === 'free').length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Free Users</p>
        </div>
        
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <Shield className="w-8 h-8 text-orange-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {users.filter(u => u.role === 'director' || u.role === 'admin').length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Admins</p>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">All Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Email</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Role</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Plan</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.user_id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{user.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{user.full_name || '-'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.role === 'director' 
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                        : user.role === 'admin'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.plan_id === 'enterprise'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                        : user.plan_id === 'pro'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : user.plan_id === 'basic'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {user.plan_name || 'Free'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            changePlan(user.user_id, e.target.value);
                            e.target.value = '';
                          }
                        }}
                        disabled={actionLoading}
                        className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="">Change Plan</option>
                        <option value="free">Free</option>
                        <option value="basic">Basic</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          fetchUserUsage(user.user_id);
                        }}
                        className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded"
                      >
                        View Usage
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected User Usage */}
      {selectedUser && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Usage for {selectedUser.email}
            </h2>
            <button
              onClick={() => setSelectedUser(null)}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Close
            </button>
          </div>
          
          {userUsage.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No usage data yet</p>
          ) : (
            <div className="space-y-4">
              {userUsage.map((usage) => (
                <div key={usage.usage_key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{usage.usage_key}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {usage.current_count} / {usage.limit_value === -1 ? '∞' : usage.limit_value}
                      </span>
                      <div className="flex-1 max-w-xs">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600"
                            style={{ width: `${Math.min(usage.percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{usage.percentage}%</span>
                    </div>
                  </div>
                  <button
                    onClick={() => resetUsage(selectedUser.user_id, usage.usage_key)}
                    disabled={actionLoading}
                    className="ml-4 px-3 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded text-sm"
                  >
                    Reset
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
