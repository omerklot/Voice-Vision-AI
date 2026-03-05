export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  jobTitle: string;
  phone?: string;
  productInterest: 'AI Vision & OCR' | 'Conversational Voice Agents' | 'Both' | 'Not sure yet';
  message?: string;
}

export interface ApiResponse {
  success: boolean;
  error?: string;
}
