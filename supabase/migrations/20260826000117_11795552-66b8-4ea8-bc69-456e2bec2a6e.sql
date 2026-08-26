CREATE TABLE public.games (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  relationship TEXT NOT NULL,
  creator_name TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  photos JSONB NOT NULL DEFAULT '[]'::jsonb,
  edition TEXT NOT NULL DEFAULT 'full',
  secret_message TEXT NOT NULL DEFAULT '',
  CONSTRAINT games_id_format CHECK (id ~ '^[a-z0-9-]{4,40}$'),
  CONSTRAINT games_relationship_valid CHECK (relationship IN ('couple','friends','siblings','family','birthday')),
  CONSTRAINT games_edition_valid CHECK (edition IN ('free','full','memory')),
  CONSTRAINT games_creator_len CHECK (char_length(creator_name) BETWEEN 1 AND 60),
  CONSTRAINT games_recipient_len CHECK (char_length(recipient_name) BETWEEN 1 AND 60),
  CONSTRAINT games_secret_len CHECK (char_length(secret_message) <= 1000)
);

GRANT SELECT, INSERT ON public.games TO anon;
GRANT SELECT, INSERT ON public.games TO authenticated;
GRANT ALL ON public.games TO service_role;

ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view games" ON public.games FOR SELECT USING (true);
CREATE POLICY "Anyone can create games" ON public.games FOR INSERT WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON public.games
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.games (id, relationship, creator_name, recipient_name, answers, photos, edition, secret_message)
VALUES (
  'demo-mila-jae', 'couple', 'Mila', 'Jae',
  '{"obsession":"spicy noodles at midnight","ritual":"reads the menu out loud, every time","joke":"the emotional support parking cone","memory":"getting caught in the rain in Lisbon","fact":"keeps a running list of dogs we''ve met"}'::jsonb,
  '[{"id":"p1","caption":"Lisbon, soaked and laughing"},{"id":"p2","caption":"The cone, in its natural habitat"},{"id":"p3","caption":"Noodle place, 12:40am"}]'::jsonb,
  'memory',
  'Jae — if you got every one of these wrong I''d still pick you. Also the cone stays in the car. Non-negotiable. 💛'
);