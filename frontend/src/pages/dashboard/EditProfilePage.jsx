import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, ChevronLeft, Save, User } from '../../lib/icons';
import { updateMe } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function EditProfilePage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', bio: '', location: '', availability: 'available' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setForm({ full_name: user.full_name || '', bio: user.bio || '', location: user.location || '', availability: user.availability || 'available' });
      setPreview(user.profile_image_url || null);
    }
  }, [user]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('profile_image', image);
      await updateMe(fd);
      await refreshUser();
      toast.success('Profile updated!');
      navigate(`/profile/${user.id}`);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') setErrors(data);
      else toast.error('Failed to update profile.');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link to={`/profile/${user?.id}`} className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Edit Profile</h1>
          <p className="text-sm text-slate-500 mt-0.5">Update your public profile information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Avatar section */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Profile Photo</h3>
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0">
              {preview ? (
                <img src={preview} alt="Preview" className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200" />
              ) : (
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl border-2 border-slate-200"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
                  {user?.full_name?.[0]?.toUpperCase() || <User size={28} />}
                </div>
              )}
              <label className="absolute -bottom-2 -right-2 w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-md">
                <Camera size={13} className="text-white" />
                <input type="file" accept="image/*" onChange={handleImage} className="sr-only" />
              </label>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Upload a new photo</p>
              <p className="text-xs text-slate-400 mt-1">JPG, PNG or GIF · Max 5MB</p>
              <label className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 cursor-pointer hover:text-blue-700">
                <Camera size={12} /> Choose file
                <input type="file" accept="image/*" onChange={handleImage} className="sr-only" />
              </label>
            </div>
          </div>
        </div>

        {/* Basic info */}
        <div className="card p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-800">Basic Information</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
            <input name="full_name" value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} required
              placeholder="Your full name" className={`input-base ${errors.full_name ? 'input-error' : ''}`} />
            {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
            <textarea name="bio" value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} rows={4}
              placeholder="Tell the community about yourself and your skills..."
              className="input-base resize-none" />
            <p className="text-xs text-slate-400 mt-1">{form.bio.length} / 500 characters</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
            <input name="location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="e.g. Dubai, UAE" className="input-base" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Availability</label>
            <select name="availability" value={form.availability}
              onChange={(e) => setForm((f) => ({ ...f, availability: e.target.value }))}
              className="input-base">
              <option value="available">✅ Available</option>
              <option value="busy">🔴 Busy</option>
              <option value="weekends_only">📅 Weekends Only</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link to={`/profile/${user?.id}`} className="btn btn-ghost flex-1 text-center flex items-center justify-center">
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="btn btn-primary flex-1 flex items-center justify-center gap-2">
            {loading ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <Save size={15} />}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
