'use client';

import { useState } from 'react';
import { getInventory } from '@/hooks/use-admin-data';
import { formatDate } from '@/lib/utils';
import styles from './inventory.module.css';

const INR = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const CAT_STYLES: Record<string, { cls: string; label: string; bg: string; color: string }> = {
  furniture: { cls: styles.catFurniture, label: 'Furniture', bg: '#fff3e0', color: '#e65100' },
  electronics: { cls: styles.catElectronics, label: 'Electronics', bg: '#e3f2fd', color: '#1565c0' },
  stationery: { cls: styles.catStationery, label: 'Stationery', bg: '#fff8e1', color: '#f57f17' },
  sports: { cls: styles.catSports, label: 'Sports', bg: '#e8f5e9', color: '#2e7d32' },
  lab: { cls: styles.catLab, label: 'Lab', bg: '#ede9fe', color: '#7c3aed' },
  library: { cls: styles.catLibrary, label: 'Library', bg: '#e0f2f1', color: '#00695c' },
  cleaning: { cls: styles.catCleaning, label: 'Cleaning', bg: '#fce4ec', color: '#c62828' },
  other: { cls: styles.catOther, label: 'Other', bg: '#f5f5f5', color: '#757575' },
};

const COND_STYLES: Record<string, string> = { good: styles.condGood, fair: styles.condFair, poor: styles.condPoor, damaged: styles.condDamaged };

export default function AdminInventoryPage() {
  const inventory = getInventory();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [condFilter, setCondFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const totalValue = inventory.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const lowStock = inventory.filter((i) => i.quantity < i.minStock);
  const categories = new Set(inventory.map((i) => i.category)).size;

  const filtered = inventory.filter((i) => {
    if (catFilter !== 'all' && i.category !== catFilter) return false;
    if (condFilter !== 'all' && i.condition !== condFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return i.name.toLowerCase().includes(q) || i.location.toLowerCase().includes(q) || i.supplier.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Inventory Management</h1>
        <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 4v12M4 10h12" /></svg>
          Add Item
        </button>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ede9fe', color: '#7c3aed' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4l8-2 8 2v3H2V4z" /><path d="M2 7v9a1 1 0 001 1h14a1 1 0 001-1V7" /></svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Items</div>
            <div className={styles.statValue}>{inventory.length}</div>
            <div className={styles.statSub}>{categories} categories</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e3f2fd', color: '#1565c0' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="16" height="12" rx="2" /><path d="M2 8h16M6 12h3" /></svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total Value</div>
            <div className={styles.statValue}>{INR.format(totalValue)}</div>
            <div className={styles.statSub}>All inventory</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ffebee', color: '#c62828' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 2v6M10 14h.01" /><circle cx="10" cy="10" r="8" /></svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Low Stock</div>
            <div className={styles.statValue}>{lowStock.length}</div>
            <div className={styles.statSub}>Below minimum</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e8f5e9', color: '#2e7d32' }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 10l2.5 2.5L14 7" /><circle cx="10" cy="10" r="8" /></svg>
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Good Condition</div>
            <div className={styles.statValue}>{inventory.filter((i) => i.condition === 'good').length}</div>
            <div className={styles.statSub}>Items in good shape</div>
          </div>
        </div>
      </div>

      <div className={styles.filtersBar}>
        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="9" r="6" /><path d="M13.5 13.5L17 17" /></svg>
          <input className={styles.searchInput} type="text" placeholder="Search inventory..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className={styles.filterSelect} value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
          <option value="all">All Categories</option>
          {Object.entries(CAT_STYLES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select className={styles.filterSelect} value={condFilter} onChange={(e) => setCondFilter(e.target.value)}>
          <option value="all">All Conditions</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
          <option value="damaged">Damaged</option>
        </select>
      </div>

      {filtered.length === 0 && <div className={styles.emptyState}>No inventory items found.</div>}

      {filtered.length > 0 && (
        <div className={styles.tableCard}>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Qty</th>
                  <th>Stock</th>
                  <th>Unit Price</th>
                  <th>Total Value</th>
                  <th>Condition</th>
                  <th>Supplier</th>
                  <th>Last Audit</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const cat = CAT_STYLES[item.category] || CAT_STYLES.other;
                  const isLow = item.quantity < item.minStock;
                  return (
                    <tr key={item.id}>
                      <td>
                        <div className={styles.itemNameCell}>
                          <div className={styles.itemIcon} style={{ background: cat.bg, color: cat.color }}>
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4l8-2 8 2v3H2V4z" /><path d="M2 7v9a1 1 0 001 1h14a1 1 0 001-1V7" /></svg>
                          </div>
                          <div className={styles.itemInfo}>
                            <div className={styles.itemName}>{item.name}</div>
                            <div className={styles.itemLocation}>{item.location}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className={`${styles.categoryBadge} ${cat.cls}`}>{cat.label}</span></td>
                      <td style={{ fontWeight: 600 }}>{item.quantity}</td>
                      <td><span className={`${styles.stockStatus} ${isLow ? styles.stockLow : styles.stockOk}`}>{isLow ? `Low (min ${item.minStock})` : 'OK'}</span></td>
                      <td>{INR.format(item.unitPrice)}</td>
                      <td style={{ fontWeight: 600 }}>{INR.format(item.quantity * item.unitPrice)}</td>
                      <td><span className={`${styles.conditionBadge} ${COND_STYLES[item.condition] || ''}`}>{item.condition}</span></td>
                      <td>{item.supplier}</td>
                      <td>{formatDate(item.lastAudit)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Add Inventory Item</h2>
              <button className={styles.modalClose} onClick={() => setShowAddModal(false)}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Item Name</label>
                <input className={styles.formInput} type="text" placeholder="e.g. Student Desk" />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Category</label>
                  <select className={styles.formSelect}>
                    {Object.entries(CAT_STYLES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Location</label>
                  <input className={styles.formInput} type="text" placeholder="e.g. Classroom Block A" />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Quantity</label>
                  <input className={styles.formInput} type="number" placeholder="0" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Minimum Stock</label>
                  <input className={styles.formInput} type="number" placeholder="0" />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Unit Price (INR)</label>
                  <input className={styles.formInput} type="number" placeholder="0" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Supplier</label>
                  <input className={styles.formInput} type="text" placeholder="Supplier name" />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Condition</label>
                  <select className={styles.formSelect}>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                    <option value="damaged">Damaged</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Purchase Date</label>
                  <input className={styles.formInput} type="date" />
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className={styles.submitBtn} onClick={() => setShowAddModal(false)}>Add Item</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
