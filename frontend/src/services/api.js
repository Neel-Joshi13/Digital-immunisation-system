const API_BASE_URL = "http://127.0.0.1:8000";

export async function loginUser(email, password) {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Login failed."
    );
  }

  return data;
}

export async function getMyUser() {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/api/users/me`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to load current user."
    );
  }

  return data;
}

export async function getMyProfile() {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/api/patients/me`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to load profile."
    );
  }

  return data;
}

export async function getMyImmunisations() {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/api/patients/me/immunisations`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Failed to load vaccination history."
    );
  }

  return data;
}

export async function getMyAppointments() {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/api/appointments/me`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Failed to load appointments."
    );
  }

  return data;
}

export async function createAppointment(
  centreId,
  appointmentDate,
  appointmentTime,
  reason
) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/api/appointments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        centre_id: Number(centreId),
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        reason: reason,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Failed to create appointment."
    );
  }

  return data;
}

export async function getCentres() {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/api/healthcare-centres`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Failed to load healthcare centres."
    );
  }

  return data;
}

export async function createHealthcareCentre(
  name,
  address,
  phone,
  email
) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/api/healthcare-centres`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        address,
        phone,
        email,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Failed to create healthcare centre."
    );
  }

  return data;
}

export async function getUsers() {
  const token =
    localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/api/users`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Failed to load users."
    );
  }

  return data;
}

export async function createUser(
  email,
  password,
  role
) {
  const token =
    localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/api/users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email,
        password,
        role,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Failed to create user."
    );
  }

  return data;
}

export async function getVaccines() {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/api/vaccines`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Failed to load vaccines."
    );
  }

  return data;
}

export async function createVaccine(
  name,
  manufacturer,
  description,
  recommendedAge,
  dosesRequired,
  sourceName,
  sourceUrl
) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/api/vaccines`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        manufacturer,
        description,
        recommended_age: recommendedAge,
        doses_required: Number(dosesRequired),
        source_name: sourceName || null,
        source_url: sourceUrl || null,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Failed to create vaccine."
    );
  }

  return data;
}

export async function getImmunisations() {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/api/immunisations`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Failed to load immunisation records."
    );
  }

  return data;
}

export async function createImmunisation(
  patientId,
  vaccineId,
  doseNumber,
  dateAdministered,
  notes
) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/api/immunisations`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        patient_id: Number(patientId),
        vaccine_id: Number(vaccineId),
        dose_number: Number(doseNumber),
        date_administered: dateAdministered,
        notes: notes,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Failed to create immunisation record."
    );
  }

  return data;
}

export async function getVaccinationSchedules() {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/api/vaccination-schedules`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Failed to load vaccination schedules."
    );
  }

  return data;
}

export async function createVaccinationSchedule(
  vaccineId,
  doseNumber,
  recommendedAge,
  minimumIntervalDays,
  notes,
  sourceName,
  sourceUrl
) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/api/vaccination-schedules`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        vaccine_id: Number(vaccineId),
        dose_number: Number(doseNumber),
        recommended_age:
          recommendedAge || null,
        minimum_interval_days:
          minimumIntervalDays
            ? Number(minimumIntervalDays)
            : null,
        notes: notes || null,
        source_name: sourceName || null,
        source_url: sourceUrl || null,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Failed to create vaccination schedule."
    );
  }

  return data;
}

export async function askVaccineAssistant(message) {
  const token = localStorage.getItem(
    "access_token"
  );

  const response = await fetch(
    `${API_BASE_URL}/api/ai/assistant?message=${encodeURIComponent(
      message
    )}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Failed to get response from AI assistant."
    );
  }

  return data;
}

export async function askAIAssistant(message) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/api/ai/assistant`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
        "Failed to get AI response."
    );
  }

  return data;
}

export async function downloadMyCertificate() {
  const token =
    localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/api/certificates/me/pdf`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    let message =
      "Failed to download vaccination certificate.";

    try {
      const data = await response.json();

      if (data.detail) {
        message = data.detail;
      }
    } catch {}

    throw new Error(message);
  }

  const blob = await response.blob();

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "vaccination-certificate.pdf";

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
}