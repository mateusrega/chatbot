/*
  # Chat Messages Schema

  ## Overview
  Creates a table to store chat messages for the school chatbot application,
  allowing users to view their conversation history.

  ## Tables Created
  
  ### `chat_messages`
  - `id` (uuid, primary key) - Unique identifier for each message
  - `session_id` (text) - Session identifier to group conversations
  - `message` (text) - The actual message content
  - `is_user` (boolean) - True if message is from user, false if from bot
  - `created_at` (timestamptz) - Timestamp when message was created
  
  ## Security
  - Enable RLS on `chat_messages` table
  - Add policy to allow anyone to read messages (public chatbot)
  - Add policy to allow anyone to insert messages (public chatbot)
  
  ## Notes
  - This is a public chatbot for educational purposes
  - Session IDs are used to group conversations without requiring authentication
  - Messages are stored for conversation continuity
*/

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  message text NOT NULL,
  is_user boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id, created_at);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read chat messages"
  ON chat_messages
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert chat messages"
  ON chat_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);