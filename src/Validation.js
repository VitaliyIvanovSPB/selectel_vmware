export const validate = (formData, setErrors) => {
    const newErrors = {};
    const numericFields = ['vcpu', 'vram', 'vssd', 'cpu_min_frequency', 'network_card_qty'];
  
    numericFields.forEach(field => {
      if (formData[field] && !/^\d+$/.test(formData[field])) {
        newErrors[field] = 'Must be a whole number';
      }
    });
  
    const slackValue = parseFloat(formData.slack_space);
    if (formData.slack_space) {
      if (isNaN(slackValue)) {
        newErrors.slack_space = 'Invalid number format';
      } else if (slackValue < 0 || slackValue > 1) {
        newErrors.slack_space = 'Must be between 0-1';
      } else if ((slackValue * 100) % 5 !== 0) {
        newErrors.slack_space = 'Must be multiple of 0.05';
      }
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };