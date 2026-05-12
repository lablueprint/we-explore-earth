import { Request, Response } from "express";

/** Reserved for generic uploads route (see `routes/uploadRouter`). Not mounted in `index.ts` yet. */
export async function uploadFile(_req: Request, res: Response) {
  return res.status(501).json({ error: "Upload endpoint not implemented" });
}

export async function getUploadSignedUrl(_req: Request, res: Response) {
  return res.status(501).json({ error: "Signed URL endpoint not implemented" });
}
