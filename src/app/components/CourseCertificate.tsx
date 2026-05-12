import { useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Share2, Award, Sparkles, CheckCircle, Calendar, Clock, Star, Trophy, Medal } from 'lucide-react';
import type { Certificate } from '../types';

interface CourseCertificateProps {
  onExit: () => void;
}

export function CourseCertificate({ onExit }: CourseCertificateProps) {
  const { theme } = useTheme();
  const { certificates } = useApp();
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');
  const [filterLevel, setFilterLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  const colors = {
    background: theme === 'dark' ? '#0A0A1A' : '#F5F7FA',
    cardBg: theme === 'dark' ? 'rgba(20, 20, 40, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    textPrimary: theme === 'dark' ? '#FFFFFF' : '#1A1A2E',
    textSecondary: theme === 'dark' ? '#B8B8D0' : '#6B7280',
    border: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    accent: theme === 'dark' ? '#6366F1' : '#4F46E5',
    success: theme === 'dark' ? '#10B981' : '#059669',
    gold: '#F59E0B',
    blur: 'blur(20px)',
  };

  const filteredCertificates = filterLevel === 'all'
    ? certificates
    : certificates.filter(cert => cert.level === filterLevel);

  const handleDownloadCertificate = (certificate: Certificate) => {
    // In production, this would generate and download a PDF certificate
    alert(`Certificate ${certificate.certificateNumber} download started!`);
  };

  const handleShareCertificate = (certificate: Certificate) => {
    // In production, this would share to social media or copy link
    alert(`Share your achievement in ${certificate.courseName}!`);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return '#10B981';
      case 'intermediate': return '#F59E0B';
      case 'advanced': return '#EF4444';
      default: return colors.accent;
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'beginner': return <Star className="w-4 h-4" />;
      case 'intermediate': return <Medal className="w-4 h-4" />;
      case 'advanced': return <Trophy className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: colors.background,
        color: colors.textPrimary,
      }}
    >
      {/* Header */}
      <div 
        className="sticky top-0 z-50"
        style={{
          background: colors.cardBg,
          backdropFilter: colors.blur,
          WebkitBackdropFilter: colors.blur,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onExit}
              className="p-2 rounded-xl transition-colors"
              style={{
                background: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              }}
              aria-label="Close certificates"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold">My Certificates</h1>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                {certificates.length} certificates earned
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6" style={{ color: colors.gold }} />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4 text-center"
            style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              color: '#FFFFFF',
            }}
          >
            <Trophy className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{certificates.length}</div>
            <div className="text-xs opacity-90">Total</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl p-4 text-center"
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#FFFFFF',
            }}
          >
            <Sparkles className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {Math.round(certificates.reduce((sum, cert) => sum + cert.score, 0) / certificates.length)}%
            </div>
            <div className="text-xs opacity-90">Avg Score</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl p-4 text-center"
            style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#FFFFFF',
            }}
          >
            <Star className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{certificates.filter(c => c.score >= 90).length}</div>
            <div className="text-xs opacity-90">Excellence</div>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
            <button
              key={level}
              onClick={() => setFilterLevel(level as typeof filterLevel)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2"
              style={{
                background: filterLevel === level 
                  ? colors.accent 
                  : theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                color: filterLevel === level ? '#FFFFFF' : colors.textSecondary,
              }}
            >
              {level === 'beginner' && <Star className="w-4 h-4" />}
              {level === 'intermediate' && <Medal className="w-4 h-4" />}
              {level === 'advanced' && <Trophy className="w-4 h-4" />}
              <span className="capitalize">{level}</span>
              {level !== 'all' && (
                <span className="text-xs opacity-75">
                  ({certificates.filter(c => c.level === level).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Certificates Grid */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredCertificates.map((certificate, index) => (
              <motion.div
                key={certificate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                }}
              >
                {/* Certificate Header with Gradient */}
                <div 
                  className="p-6 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${getLevelColor(certificate.level)}22 0%, ${getLevelColor(certificate.level)}11 100%)`,
                  }}
                >
                  <div className="absolute top-0 right-0 opacity-10">
                    <Award className="w-32 h-32" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div 
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3"
                          style={{ 
                            background: getLevelColor(certificate.level),
                            color: '#FFFFFF',
                          }}
                        >
                          {getLevelIcon(certificate.level)}
                          <span className="capitalize">{certificate.level}</span>
                        </div>
                        <h3 className="text-lg font-bold mb-1">{certificate.courseName}</h3>
                        <p className="text-sm" style={{ color: colors.textSecondary }}>
                          {certificate.courseCategory} • {certificate.instructor}
                        </p>
                      </div>
                      <div 
                        className="px-4 py-2 rounded-full text-2xl font-bold"
                        style={{
                          background: certificate.score >= 90 ? colors.gold : colors.accent,
                          color: '#FFFFFF',
                        }}
                      >
                        {certificate.score}%
                      </div>
                    </div>

                    {/* Certificate Details */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4" style={{ color: colors.textSecondary }} />
                        <span style={{ color: colors.textSecondary }}>
                          {new Date(certificate.completionDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4" style={{ color: colors.textSecondary }} />
                        <span style={{ color: colors.textSecondary }}>{certificate.duration}</span>
                      </div>
                    </div>

                    {/* Skills Badges */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {certificate.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                            color: colors.textSecondary,
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Certificate Number */}
                    <div 
                      className="mt-4 pt-4 flex items-center gap-2"
                      style={{ borderTop: `1px solid ${colors.border}` }}
                    >
                      <CheckCircle className="w-4 h-4" style={{ color: colors.success }} />
                      <span className="text-xs font-mono" style={{ color: colors.textSecondary }}>
                        {certificate.certificateNumber}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div 
                  className="flex gap-2 p-4"
                  style={{
                    background: theme === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.02)',
                  }}
                >
                  <Button
                    onClick={() => handleDownloadCertificate(certificate)}
                    className="flex-1 h-11 rounded-xl font-semibold"
                    style={{
                      background: colors.accent,
                      color: '#FFFFFF',
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    onClick={() => handleShareCertificate(certificate)}
                    className="flex-1 h-11 rounded-xl font-semibold"
                    style={{
                      background: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                      color: colors.textPrimary,
                    }}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredCertificates.length === 0 && (
          <div className="text-center py-12">
            <Award className="w-16 h-16 mx-auto mb-4" style={{ color: colors.textSecondary, opacity: 0.5 }} />
            <h3 className="text-lg font-semibold mb-2">No certificates found</h3>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Complete courses to earn certificates at this level
            </p>
          </div>
        )}
      </div>
    </div>
  );
}