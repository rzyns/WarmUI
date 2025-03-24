import { ColorSchemeToggle } from "../components/ColorSchemeToggle/ColorSchemeToggle";
import { WarmShell } from "../components/WarmShell/WarmShell";
import { Welcome } from "../components/Welcome/Welcome";

export function HomePage() {
    return (
        <WarmShell>
            <Welcome />
            <ColorSchemeToggle />
        </WarmShell>
    );
}
