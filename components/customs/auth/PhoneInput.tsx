import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import "flag-icons/css/flag-icons.min.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Sample country codes (you can expand this list)
const countryCodes = [
  { code: "+84", iso: "VN" },
  { code: "+1", iso: "US" },
  { code: "+44", iso: "GB" },
  { code: "+81", iso: "JP" },
  { code: "+82", iso: "KR" },
  { code: "+61", iso: "AU" },
];
export default function PhoneInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [countryCode, setCountryCode] = useState("+84");
  const [phone, setPhone] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setPhone(val);
    onChange?.(`${countryCode}${val}`);
  };

  const handleCodeChange = (code: string) => {
    setCountryCode(code);
    onChange?.(`${code}${phone}`);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Select value={countryCode} onValueChange={handleCodeChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {countryCodes.map((item) => (
              <SelectItem key={item.code} value={item.code}>
                <span className={`fi fi-${item.iso.toLowerCase()}`}></span>
                {item.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="tel"
          placeholder="Enter your phone number"
          value={phone}
          onChange={handlePhoneChange}
        />
      </div>
    </div>
  );
}
