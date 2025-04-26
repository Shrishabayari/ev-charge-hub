export const addEvBunk = async (req, res) => {
    try {
      // Implementation will go here
      res.status(200).json({ message: "Bunk controller working" });
    } catch (error) {
      console.error('Error in bunk controller:', error);
      res.status(500).json({ message: 'Operation failed', error: error.message });
    }
  };