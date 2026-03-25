import { useState, useEffect, useCallback } from "react";
import "@/App.css";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Copy, Check, Sparkles, Clock, Hash, AlertCircle, Loader2, Instagram, Facebook } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_KEY;

const CAMPAIGN_TYPES = [
  { value: "weekend-workshop", label: "Weekend Workshop" },
  { value: "free-trial", label: "Free Trial Class" },
  { value: "seasonal-intensive", label: "Seasonal Intensive" },
  { value: "open-studio", label: "Open Studio" },
];

const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: Instagram },
  { id: "tiktok", label: "TikTok", icon: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  )},
  { id: "facebook", label: "Facebook", icon: Facebook },
];

const EMPTY_STATE_IMAGE = "https://images.unsplash.com/photo-1741335661631-439871f2b3b6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MjJ8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGFydCUyMHdhcm18ZW58MHx8fHwxNzc0NDIxOTgxfDA&ixlib=rb-4.1.0&q=85&w=640";

// Generate campaign using OpenAI API
const generateCampaignWithAI = async (budget, dateRange, campaignType, platforms) => {
  const platformsStr = platforms.join(", ");
  
  const prompt = `You are a social media marketing expert for an art school. Generate a 7-day posting schedule for a marketing campaign.

Campaign Details:
- Type: ${campaignType}
- Budget: $${budget}
- Date Range: ${dateRange.start} to ${dateRange.end}
- Platforms: ${platformsStr}

For each of the 7 days, provide:
1. A suggested post time (optimize based on typical engagement - morning posts for motivation, afternoon for engagement, evening for reflection)
2. A caption (150-200 words) that is warm, art-focused, inspiring, and speaks to creative souls. Include a call-to-action.
3. 8-12 relevant hashtags for art schools and creative education

Return ONLY valid JSON in this exact format with no additional text:
{
  "schedule": [
    {
      "day": "Day 1 - Monday",
      "postTime": "9:00 AM",
      "caption": "Your inspiring caption here...",
      "hashtags": ["#artschool", "#creativity", "#art", "#learn", "#creative", "#artist", "#artclass", "#drawing"]
    }
  ]
}

Make each day's content unique and build a narrative arc across the week. Start with awareness, build excitement, and end with a strong call-to-action. Generate exactly 7 days.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert social media marketer specializing in art education. You create warm, inspiring content that resonates with creative individuals. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No content in API response");
  }

  // Parse JSON from response
  let parsed;
  try {
    let jsonStr = content.trim();
    // Handle markdown code blocks
    if (jsonStr.includes("```json")) {
      jsonStr = jsonStr.split("```json")[1].split("```")[0].trim();
    } else if (jsonStr.includes("```")) {
      jsonStr = jsonStr.split("```")[1].split("```")[0].trim();
    }
    parsed = JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse AI response:", content);
    throw new Error("Failed to parse campaign content");
  }

  return parsed.schedule;
};

// Skeleton loader component
const ScheduleSkeleton = () => (
  <div className="space-y-6">
    {[...Array(7)].map((_, i) => (
      <div key={i} className="relative pl-10">
        <div className="absolute left-1 top-2 w-5 h-5 rounded-full skeleton-shimmer" />
        {i < 6 && <div className="absolute left-[11px] top-8 bottom-0 w-0.5 skeleton-shimmer" />}
        <div className="bg-white border border-[#E7E5DF] rounded-xl p-6">
          <div className="h-6 w-32 skeleton-shimmer rounded mb-4" />
          <div className="h-4 w-24 skeleton-shimmer rounded mb-6" />
          <div className="space-y-2 mb-6">
            <div className="h-4 skeleton-shimmer rounded w-full" />
            <div className="h-4 skeleton-shimmer rounded w-full" />
            <div className="h-4 skeleton-shimmer rounded w-3/4" />
          </div>
          <div className="flex flex-wrap gap-2">
            {[...Array(8)].map((_, j) => (
              <div key={j} className="h-6 w-20 skeleton-shimmer rounded-full" />
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Day card component
const DayCard = ({ day, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const text = `${day.caption}\n\n${day.hashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' ')}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast.error("Failed to copy");
    });
  }, [day]);

  return (
    <div 
      className="relative pl-10 animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
      data-testid={`day-card-${index + 1}`}
    >
      {/* Timeline node */}
      <div className="timeline-node" />
      {/* Timeline line */}
      {index < 6 && <div className="timeline-line" />}
      
      <div className="day-card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-display text-xl font-bold text-[#1C1917]">{day.day}</h3>
            <div className="flex items-center gap-2 text-[#57534E] mt-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{day.postTime}</span>
            </div>
          </div>
        </div>
        
        <p className="text-[#1C1917] leading-relaxed mb-6 font-body">{day.caption}</p>
        
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-4 h-4 text-[#57534E]" />
            <span className="label-overline">Hashtags</span>
          </div>
          <div className="flex flex-wrap">
            {day.hashtags.map((tag, idx) => (
              <span key={idx} className="hashtag-pill">
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        </div>
        
        <button
          onClick={handleCopy}
          className={cn("copy-btn", copied && "copied")}
          data-testid={`copy-btn-day-${index + 1}`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied!" : "Copy to clipboard"}
        </button>
      </div>
    </div>
  );
};

// Empty state component
const EmptyState = () => (
  <div className="empty-state">
    <img 
      src={EMPTY_STATE_IMAGE} 
      alt="Abstract art" 
      className="shadow-lg"
    />
    <h2 className="font-display text-3xl font-bold text-[#1C1917] mb-3">
      Your canvas awaits
    </h2>
    <p className="text-[#57534E] text-lg max-w-md mx-auto">
      Create your first campaign to see a beautiful 7-day posting schedule crafted just for your art school.
    </p>
  </div>
);

// Main App component
function App() {
  // Form state
  const [budget, setBudget] = useState([100]);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [campaignType, setCampaignType] = useState("");
  const [platforms, setPlatforms] = useState([]);
  
  // Campaign state
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Lead form state
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadInterest, setLeadInterest] = useState("");
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);

  // Load campaign from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("art-campaigns");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.schedule) {
          setCampaign(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load saved campaign:", e);
    }
  }, []);

  // Check if form is valid
  const isFormValid = budget[0] >= 20 && 
    dateRange.from && 
    dateRange.to && 
    campaignType && 
    platforms.length > 0;

  // Toggle platform selection
  const togglePlatform = (platformId) => {
    setPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  // Generate campaign
  const generateCampaign = async () => {
    if (!isFormValid) return;
    
    setIsLoading(true);
    setError("");
    setCampaign(null);

    try {
      const campaignTypeLabel = CAMPAIGN_TYPES.find(t => t.value === campaignType)?.label || campaignType;
      
      const schedule = await generateCampaignWithAI(
        budget[0],
        {
          start: format(dateRange.from, "yyyy-MM-dd"),
          end: format(dateRange.to, "yyyy-MM-dd"),
        },
        campaignTypeLabel,
        platforms
      );

      const campaignData = {
        timestamp: new Date().toISOString(),
        budget: budget[0],
        dateRange: {
          start: format(dateRange.from, "yyyy-MM-dd"),
          end: format(dateRange.to, "yyyy-MM-dd"),
        },
        type: campaignTypeLabel,
        platforms: platforms,
        schedule: schedule,
      };
      
      // Save to localStorage
      try {
        localStorage.setItem("art-campaigns", JSON.stringify(campaignData));
      } catch (e) {
        console.error("Failed to save campaign:", e);
        toast.error("Campaign generated but failed to save locally");
      }
      
      setCampaign(campaignData);
      toast.success("Campaign generated successfully!");
    } catch (err) {
      console.error("Campaign generation failed:", err);
      const errorMsg = err.message || "Failed to generate campaign. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit lead form
  const submitLead = (e) => {
    e.preventDefault();
    
    if (!leadName.trim() || !leadEmail.trim() || !leadInterest) {
      toast.error("Please fill in all fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leadEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLeadSubmitting(true);

    try {
      const lead = {
        name: leadName.trim(),
        email: leadEmail.trim(),
        interest: leadInterest,
        timestamp: new Date().toISOString(),
      };

      // Get existing leads
      const existingLeads = JSON.parse(localStorage.getItem("art-leads") || "[]");
      existingLeads.push(lead);
      localStorage.setItem("art-leads", JSON.stringify(existingLeads));

      setLeadSuccess(true);
      setLeadName("");
      setLeadEmail("");
      setLeadInterest("");
      toast.success("Thank you for your interest! We'll be in touch soon.");
      
      setTimeout(() => setLeadSuccess(false), 3000);
    } catch (e) {
      console.error("Failed to save lead:", e);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setLeadSubmitting(false);
    }
  };

  return (
    <div className="app-container min-h-screen font-body">
      <Toaster position="top-right" richColors />
      
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Left Sidebar - Campaign Form */}
        <aside className="sidebar md:col-span-4 lg:col-span-3 p-8 md:h-screen md:sticky md:top-0 md:overflow-y-auto" data-testid="campaign-sidebar">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-[#1C1917] tracking-tight mb-2">
              Campaign Planner
            </h1>
            <p className="text-[#57534E]">Create your art school's marketing magic</p>
          </div>

          <div className="space-y-8">
            {/* Budget Slider */}
            <div>
              <Label className="label-overline">Budget</Label>
              <div className="mt-3 px-1">
                <Slider
                  value={budget}
                  onValueChange={setBudget}
                  min={20}
                  max={500}
                  step={10}
                  className="slider-terracotta"
                  data-testid="budget-slider"
                />
                <div className="flex justify-between mt-2 text-sm text-[#57534E]">
                  <span>$20</span>
                  <span className="font-semibold text-[#C8553D]">${budget[0]}</span>
                  <span>$500</span>
                </div>
              </div>
            </div>

            {/* Date Range Picker */}
            <div>
              <Label className="label-overline">Campaign Dates</Label>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal border-[#E7E5DF] bg-white hover:bg-[#F5F2EA] hover:border-[#C8553D]",
                        !dateRange.from && "text-[#57534E]"
                      )}
                      data-testid="date-start-picker"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-[#C8553D]" />
                      {dateRange.from ? format(dateRange.from, "MMM d") : "Start"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white border-[#E7E5DF]" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal border-[#E7E5DF] bg-white hover:bg-[#F5F2EA] hover:border-[#C8553D]",
                        !dateRange.to && "text-[#57534E]"
                      )}
                      data-testid="date-end-picker"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-[#C8553D]" />
                      {dateRange.to ? format(dateRange.to, "MMM d") : "End"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white border-[#E7E5DF]" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                      disabled={(date) => date < (dateRange.from || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Campaign Type */}
            <div>
              <Label className="label-overline">Campaign Type</Label>
              <Select value={campaignType} onValueChange={setCampaignType}>
                <SelectTrigger 
                  className="mt-3 border-[#E7E5DF] bg-white focus:ring-[#C8553D]/30 focus:border-[#C8553D]"
                  data-testid="campaign-type-select"
                >
                  <SelectValue placeholder="Select campaign type" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#E7E5DF]">
                  {CAMPAIGN_TYPES.map(type => (
                    <SelectItem 
                      key={type.value} 
                      value={type.value}
                      className="focus:bg-[#F5F2EA] focus:text-[#1C1917]"
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Platform Multi-select */}
            <div>
              <Label className="label-overline">Platforms</Label>
              <div className="space-y-2 mt-3">
                {PLATFORMS.map(platform => {
                  const Icon = platform.icon;
                  const isSelected = platforms.includes(platform.id);
                  return (
                    <label
                      key={platform.id}
                      className={cn("platform-checkbox", isSelected && "selected")}
                      data-testid={`platform-${platform.id}`}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => togglePlatform(platform.id)}
                        className="border-[#E7E5DF] data-[state=checked]:bg-[#C8553D] data-[state=checked]:border-[#C8553D]"
                      />
                      <Icon className="w-5 h-5 text-[#57534E]" />
                      <span className="font-medium text-[#1C1917]">{platform.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateCampaign}
              disabled={!isFormValid || isLoading}
              className="btn-primary w-full bg-[#C8553D] hover:bg-[#A64530] text-white disabled:bg-[#E7E5DF] disabled:text-[#57534E]"
              data-testid="generate-campaign-btn"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Campaign
                </>
              )}
            </Button>

            {!isFormValid && (
              <p className="text-sm text-[#57534E] text-center">
                Fill in all fields to generate your campaign
              </p>
            )}
          </div>
        </aside>

        {/* Main Panel - Schedule Timeline */}
        <main className="main-panel md:col-span-8 lg:col-span-9 p-8 md:p-12" data-testid="schedule-panel">
          {/* Error Message */}
          {error && (
            <div className="error-message flex items-center gap-3 mb-6" data-testid="error-message">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div>
              <h2 className="font-display text-2xl font-bold text-[#1C1917] mb-6">
                Creating your 7-day schedule...
              </h2>
              <ScheduleSkeleton />
            </div>
          )}

          {/* Campaign Schedule */}
          {!isLoading && campaign && campaign.schedule && (
            <div>
              <div className="mb-8">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1C1917] mb-2">
                  Your 7-Day Campaign
                </h2>
                <p className="text-[#57534E]">
                  {campaign.type} · ${campaign.budget} budget · {campaign.platforms?.join(", ")}
                </p>
              </div>
              <div className="space-y-6">
                {campaign.schedule.map((day, index) => (
                  <DayCard key={index} day={day} index={index} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !campaign && !error && <EmptyState />}
        </main>
      </div>

      {/* Bottom Section - Lead Capture */}
      <section className="lead-section py-16 md:py-20 px-8" data-testid="lead-capture-section">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1C1917] mb-4">
            Interested in our classes?
          </h2>
          <p className="text-[#57534E] text-lg mb-10">
            Leave your details and we'll reach out with more information about our art programs.
          </p>

          {leadSuccess && (
            <div className="success-message mb-6" data-testid="lead-success">
              Thank you! We've received your information and will be in touch soon.
            </div>
          )}

          <form onSubmit={submitLead} className="space-y-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="lead-name" className="label-overline">Name</Label>
                <Input
                  id="lead-name"
                  type="text"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Your name"
                  className="mt-2 border-[#E7E5DF] bg-white focus:ring-[#C8553D]/30 focus:border-[#C8553D]"
                  data-testid="lead-name-input"
                />
              </div>
              <div>
                <Label htmlFor="lead-email" className="label-overline">Email</Label>
                <Input
                  id="lead-email"
                  type="email"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="mt-2 border-[#E7E5DF] bg-white focus:ring-[#C8553D]/30 focus:border-[#C8553D]"
                  data-testid="lead-email-input"
                />
              </div>
            </div>
            
            <div>
              <Label className="label-overline">Class Interest</Label>
              <Select value={leadInterest} onValueChange={setLeadInterest}>
                <SelectTrigger 
                  className="mt-2 border-[#E7E5DF] bg-white focus:ring-[#C8553D]/30 focus:border-[#C8553D]"
                  data-testid="lead-interest-select"
                >
                  <SelectValue placeholder="What interests you most?" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#E7E5DF]">
                  {CAMPAIGN_TYPES.map(type => (
                    <SelectItem 
                      key={type.value} 
                      value={type.value}
                      className="focus:bg-[#F5F2EA] focus:text-[#1C1917]"
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-center pt-4">
              <Button
                type="submit"
                disabled={leadSubmitting}
                className="btn-primary px-12 bg-[#C8553D] hover:bg-[#A64530] text-white"
                data-testid="lead-submit-btn"
              >
                {leadSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Get in Touch"
                )}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default App;
