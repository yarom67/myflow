import type { Category } from '../types';

export const DEFAULT_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'מזון', icon: 'ShoppingCart', color: '#10B981', monthlyBudget: 2000 },
  { name: 'תחבורה', icon: 'Car', color: '#3B82F6', monthlyBudget: 800 },
  { name: 'דיור', icon: 'Home', color: '#8B5CF6', monthlyBudget: 5000 },
  { name: 'בילויים', icon: 'Clapperboard', color: '#F59E0B', monthlyBudget: 1000 },
  { name: 'קניות', icon: 'ShoppingBag', color: '#EC4899', monthlyBudget: 800 },
  { name: 'בריאות', icon: 'Heart', color: '#EF4444', monthlyBudget: 500 },
  { name: 'חינוך', icon: 'BookOpen', color: '#06B6D4', monthlyBudget: 600 },
  { name: 'טיולים', icon: 'Plane', color: '#14B8A6', monthlyBudget: 1500 },
  { name: 'חשבונות', icon: 'Lightbulb', color: '#F97316', monthlyBudget: 1200 },
  { name: 'הכנסה', icon: 'Wallet', color: '#7C3AED' },
];

export const CATEGORY_ICONS = [
  'ShoppingCart', 'Car', 'Home', 'Clapperboard', 'ShoppingBag',
  'Heart', 'BookOpen', 'Plane', 'Lightbulb', 'Wallet',
  'Coffee', 'Utensils', 'Dumbbell', 'Music', 'Gift',
  'Smartphone', 'Wifi', 'Baby', 'Dog', 'Scissors',
  'Wrench', 'GraduationCap', 'Briefcase', 'Building2',
] as const;

export const CATEGORY_COLORS = [
  '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899',
  '#EF4444', '#06B6D4', '#14B8A6', '#F97316', '#7C3AED',
  '#84CC16', '#6366F1', '#D946EF', '#0EA5E9',
] as const;

export const CURRENCY_OPTIONS = [
  { value: 'ILS', label: '₪ שקל', symbol: '₪' },
  { value: 'USD', label: '$ דולר', symbol: '$' },
  { value: 'EUR', label: '€ יורו', symbol: '€' },
] as const;

export const NAV_ITEMS = [
  { path: '/', label: 'דשבורד', icon: 'LayoutDashboard' },
  { path: '/transactions', label: 'תנועות', icon: 'ArrowLeftRight' },
  { path: '/settings', label: 'הגדרות', icon: 'Settings' },
] as const;
