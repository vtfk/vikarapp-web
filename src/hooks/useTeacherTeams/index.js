import config from '../../config'
import axios from "axios";
import { useState } from "react";
import { getValidBearerToken, login } from '../../auth'

export default function useTeacherTeams() {
  const [teacherTeams, setTeacherTeams] = useState([]);
  const [isLoadingTeams, setIsLoading] = useState(false);

  async function search(id) {
    if(!id || typeof id !== 'string' || id.length <= 8) return;

    setIsLoading(true);

    const token = getValidBearerToken();
    if(!token) await login({ type: 'popup' })

    const request = {
      url: `${config.vikarAPIBaseurl}teacherteams/${id}`,
      method: 'GET',
      headers: {
        Authorization: token
      }
    }

    try {
      const { data } = await axios.request(request);
      setTeacherTeams(data);
      setIsLoading(false);
      return data;
    } catch {
      setTeacherTeams([]);
      setIsLoading(false);
      return [];
    }
  }

  return { teacherTeams, setTeacherTeams, search, isLoadingTeams }
}