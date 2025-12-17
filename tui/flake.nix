{
  description = "BenQ Projector Control TUI";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        packages.default = pkgs.buildGoModule {
          pname = "benq-control";
          version = "0.1.0";

          src = ./.;

          vendorHash = "sha256-kcK+tAL3L8/RC7AWQ9KN4xcGOG3EqSBcg8dRkR/lAMo=";

          subPackages = [ "src" ];

          postInstall = ''
            mv $out/bin/src $out/bin/benq-control
            mkdir -p $out/share/benq-control
            cp -r ${./data} $out/share/benq-control/data
          '';

          meta = with pkgs.lib; {
            description = "BenQ Projector Control TUI";
            license = licenses.mit;
          };
        };

        apps.default = {
          type = "app";
          program = "${self.packages.${system}.default}/bin/benq-control";
        };

        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [ go gopls gotools ];
        };
      }
    );
}
