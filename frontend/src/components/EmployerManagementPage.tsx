import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  Mail,
  Globe,
  MapPin,
  Phone,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { useAuth } from "../contexts/AuthContext";
import {
  fetchEmployer,
  discontinueEmployer,
  continueEmployer,
  EmployerResponse,
} from "../api/employers";

interface EmployerManagementPageProps {
  onNavigate: (page: string) => void;
  employerId?: string;
}

export function EmployerManagementPage({
  onNavigate,
  employerId,
}: EmployerManagementPageProps) {
  const { token } = useAuth();
  const [employer, setEmployer] = useState<EmployerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (employerId && token) {
      loadEmployer();
    }
  }, [employerId, token]);

  const loadEmployer = async () => {
    if (!employerId || !token) return;

    try {
      setLoading(true);
      const data = await fetchEmployer(employerId, token);
      setEmployer(data);
    } catch (error) {
      console.error("Failed to load employer:", error);
      alert("Failed to load employer details");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscontinue = async () => {
    if (!employer || !token) return;

    if (
      !window.confirm(
        `Are you sure you want to discontinue "${employer.companyName}"? This will prevent them from posting new jobs.`,
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);
      await discontinueEmployer(employer.id, token);
      await loadEmployer();
      alert("Employer discontinued successfully");
    } catch (error) {
      console.error("Failed to discontinue employer:", error);
      alert("Failed to discontinue employer");
    } finally {
      setActionLoading(false);
    }
  };

  const handleContinue = async () => {
    if (!employer || !token) return;

    if (
      !window.confirm(
        `Are you sure you want to reactivate "${employer.companyName}"?`,
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);
      await continueEmployer(employer.id, token);
      await loadEmployer();
      alert("Employer reactivated successfully");
    } catch (error) {
      console.error("Failed to continue employer:", error);
      alert("Failed to reactivate employer");
    } finally {
      setActionLoading(false);
    }
  };

  const getVerificationStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getEmployerStatusBadge = (status?: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
      case "discontinued":
        return <Badge className="bg-red-100 text-red-800">Discontinued</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
    }
  };

  const getCompanyTypeBadge = (type: string) => {
    switch (type) {
      case "hospital":
        return (
          <Badge className="bg-purple-100 text-purple-800">Hospital</Badge>
        );
      case "consultancy":
        return (
          <Badge className="bg-orange-100 text-orange-800">Consultancy</Badge>
        );
      case "hr":
        return <Badge className="bg-cyan-100 text-cyan-800">HR Agency</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading employer details...</p>
        </div>
      </div>
    );
  }

  if (!employer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Employer Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The employer you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => onNavigate("admin-employer-verification")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Verification
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="outline"
              onClick={() => onNavigate("admin-employer-verification")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Verification
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              Employer Management
            </h1>
            <p className="text-gray-600">View and manage employer details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details Card */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {employer.companyName}
                  </h2>
                  {getCompanyTypeBadge(employer.companyType)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Contact Name</p>
                        <p className="font-medium">
                          {employer.userName || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">
                          {employer.userEmail || "N/A"}
                        </p>
                      </div>
                    </div>
                    {employer.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Website</p>
                          <a
                            href={employer.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-blue-600 hover:underline"
                          >
                            {employer.website}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Address
                  </h3>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      {employer.address && (
                        <p className="font-medium">{employer.address}</p>
                      )}
                      <p className="text-gray-600">
                        {[employer.city, employer.state, employer.pincode]
                          .filter(Boolean)
                          .join(", ") || "Address not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Company Description */}
                {employer.companyDescription && (
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-600">
                      {employer.companyDescription}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Status & Actions Card */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Status
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Verification Status
                  </p>
                  {getVerificationStatusBadge(employer.verificationStatus)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Employer Status</p>
                  {getEmployerStatusBadge(employer.employerStatus)}
                </div>
                {employer.verifiedAt && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Verified At</p>
                    <p className="font-medium">
                      {new Date(employer.verifiedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {employer.createdAt && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Registered On</p>
                    <p className="font-medium">
                      {new Date(employer.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Verification Notes */}
              {employer.verificationNotes && (
                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">
                    Verification Notes
                  </p>
                  <p className="text-gray-700">{employer.verificationNotes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Actions
                </h4>
                {employer.verificationStatus === "approved" && (
                  <>
                    {employer.employerStatus === "active" ||
                    !employer.employerStatus ? (
                      <Button
                        variant="destructive"
                        onClick={handleDiscontinue}
                        disabled={actionLoading}
                        className="w-full"
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        {actionLoading
                          ? "Processing..."
                          : "Discontinue Employer"}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleContinue}
                        disabled={actionLoading}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {actionLoading ? "Processing..." : "Continue Employer"}
                      </Button>
                    )}
                  </>
                )}
                {employer.verificationStatus !== "approved" && (
                  <p className="text-sm text-gray-500 text-center">
                    Only approved employers can be discontinued or continued.
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
